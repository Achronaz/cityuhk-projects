
import java.util.Scanner;

import util.Utils;
import view.PublicView;

public class Main {
	static Scanner sc = new Scanner(System.in);
	public static void main(String[] args) {
		try {
			Utils.initJsonDb();
			new PublicView(sc).showMenu();
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
}
