package cs4296;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.jobcontrol.ControlledJob;
import org.apache.hadoop.mapreduce.lib.jobcontrol.JobControl;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;

public class Bow {
	
	private final static AmazonS3 s3 = AmazonS3ClientBuilder.defaultClient();
	
	private final static List<String> top100Word = Arrays.asList(new String[]{ "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
			"it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they",
			"we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
			"up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no",
			"just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see",
			"other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after",
			"use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any",
			"these", "give", "day", "most", "us"});
	
	//private static Map<String, Integer> wordMap = initMap();
	
	public static LinkedHashMap<String, Integer> initMap(){
		LinkedHashMap<String, Integer> map = new LinkedHashMap<String, Integer>();
		for(String key : top100Word) {
			map.put(key, 0);
		}
		return map;
	}
	
	public static String parseContent(String content) {
		return content
				.toLowerCase()
				.replaceAll("[^a-z0-9]", " ")
				.trim()
				.replaceAll("[ ]{2,}", " ");
	}
	
	public static class BowMap extends Mapper<Object, Text, Text, IntWritable> {
		private final static IntWritable one = new IntWritable(1);
		private Text word = new Text();
		public void map(Object key, Text value, Context context) throws IOException, InterruptedException {		
			String parsedContent = parseContent(value.toString());
			StringTokenizer itr = new StringTokenizer(parsedContent, " ");
			while (itr.hasMoreTokens()) {
				word.set(itr.nextToken());
				if(top100Word.contains(word.toString())) {
					context.write(word, one);
				}
			}
		}
	}

	public static class BowReduce extends Reducer<Text, IntWritable, Text, IntWritable> {
		private IntWritable result = new IntWritable();
		public void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
			int sum = 0;
			for (IntWritable val : values) {
				sum += val.get();
			}
			result.set(sum);
			context.write(key, result);
		}
	}
	
	public static void setJob(Job job) throws IOException {
		job.setJarByClass(Bow.class);
		job.setMapperClass(BowMap.class);
		job.setCombinerClass(BowReduce.class);
		job.setReducerClass(BowReduce.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
	}
	
	public static void run(String[] args) throws IOException, InterruptedException {
		
		Configuration conf = new Configuration();
		String[] otherargs = new GenericOptionsParser(conf, args).getRemainingArgs();
		if (otherargs.length != 3) {
			System.err.println("args[0]=<bucketName>, args[1]=<InputFolder>, args[2]=<OutputFolder>");
			System.exit(0);
		}
		
		System.out.println("Bow start");
		
		final String bucketName = args[0];
		final String inputPath = args[1];
		final String outputPath = args[2];
		
		JobControl jobControl = new JobControl("JobControl Bow");
		
		ListObjectsV2Result inputFolder = s3.listObjectsV2(bucketName, inputPath);
		Integer index = 1;
		//job 1 to n - 1
		for(S3ObjectSummary inputFile : inputFolder.getObjectSummaries()) {
			if(!inputFile.getKey().endsWith("/")) { //not dir
				Job job = Job.getInstance(conf, "Bow Job "+index);
				setJob(job);
				FileInputFormat.addInputPath(job, new Path("s3://"+bucketName+"/"+inputFile.getKey()));
				FileOutputFormat.setOutputPath(job, new Path("s3://"+bucketName+"/"+outputPath + String.format("/bow/file%02d", index)));
				ControlledJob controlledJob = new ControlledJob(conf);
				controlledJob.setJob(job);
				jobControl.addJob(controlledJob);
				index++;
			}
			
		}
		
		//run all job
		new Thread(jobControl).start();
		while(!jobControl.allFinished())
			Thread.sleep(500);
		jobControl.stop();
		
		//all jobs finished, read and write output file
		String result = "";
		for(int i=1; i<index; i++) {
			Map<String, Integer> wordMap = initMap();
			ListObjectsV2Result outputFolder = s3.listObjectsV2(bucketName, outputPath + String.format("/bow/file%02d", i));
			result += String.format("file%02d\t", i);
			//merge part and add to wordMap
			for(S3ObjectSummary outputFile : outputFolder.getObjectSummaries()) {
				if(!outputFile.getKey().endsWith("/")) { //not dir
					S3Object file = s3.getObject(new GetObjectRequest(bucketName, outputFile.getKey()));
					BufferedReader reader = new BufferedReader(new InputStreamReader(file.getObjectContent()));
					String line;
					while((line = reader.readLine()) != null) {
						String key = line.split("\t")[0];
						Integer count = Integer.parseInt(line.split("\t")[1]);
						wordMap.replace(key, count);
					}
				}
			}
			for(String key : top100Word) {
				result += wordMap.get(key) + ", ";
			}
			result = result.substring(0, result.length() - 2) + "\n";
		}
		s3.putObject(bucketName, outputPath + "/Q1_Result.txt", result);
		
		System.out.println("Bow end");
		
	}
	
	public static void main(String[] args) throws Exception {
		run(args);
	}
}