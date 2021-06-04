package cs4296;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3ObjectSummary;

public class Driver {
	
	private final static AmazonS3 s3 = AmazonS3ClientBuilder.defaultClient();
	
	public static void clearFolder(String bucketName, String outputPath) {
		ListObjectsV2Result folder = s3.listObjectsV2(bucketName, outputPath);
		for(S3ObjectSummary file : folder.getObjectSummaries()) {
			s3.deleteObject(bucketName, file.getKey());
		}
	}
	
	public static void main(String[] args) throws Exception {

		clearFolder(args[0], args[2]);
		Bow.run(args);
		Dist.run(args);

	}
	
	
}
