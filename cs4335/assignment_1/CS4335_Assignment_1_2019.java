public class CS4335_Assignment_1_2019 {

	public static void main(String[] args) {
		int[] A = { 1, 8, 3, 1, 2, 8, 100 };
		minSumOfPartitions(A, 2);
		minSumOfPartitions(A, 3);
		minSumOfPartitions(A, 4);
		minSumOfPartitions(A, 5);
		minSumOfPartitions(A, 6);
	}
    
	public static void minSumOfPartitions(int[] A, int k) {

		int n = A.length;
		int[][] M = new int[n][n];
		int[][] OPT = new int[n][k + 1];

		for (int i = 0; i < n; i++) {
			M[i][i] = A[i];
			for (int j = i + 1; j < n; j++) {
				M[i][j] = Math.max(M[i][j - 1], A[j]);
			}
		}

		for (int i = 0; i < n; i++) {
			OPT[i][1] = M[i][n - 1];
		}

		for (int i = n - 1; i >= 0; i--) {
			for (int j = 2; j <= k; j++) {
				OPT[i][j] = Integer.MAX_VALUE;
				for (int c = n - j - 1; c >= i; c--) {
					OPT[i][j] = Math.min(OPT[i][j], M[i][c] + OPT[c + 1][j - 1]);
				}
			}
		}
		System.out.println("M:");
		visualize(M);
		System.out.println("OPT:");
		visualize(OPT);
		System.out.println("Sum(min):" + OPT[0][k]);
	}

	public static void visualize(int[][] a) {
		for (int i = 0; i < a.length; i++) {
			for (int j = 0; j < a[0].length; j++) {
				System.out.print(a[i][j] == Integer.MAX_VALUE ? "max " : a[i][j] + " ");
			}
			System.out.println();
		}
	}
}
