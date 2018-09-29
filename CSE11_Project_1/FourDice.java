import java.util.Random;
import java.util.Scanner;

/*
 * Name: Thuc Nguyen
 * Email: thn079@ucsd.edu
 * ID: A****8658
 * */

public class FourDice {

	public static void sortArray(int[] numbers, int length) {
		for (int i = 0; i < length; ++i) {
			for (int j = (i + 1); j < length; ++j) {
				int firstNum = numbers[i];
				int secNum = numbers[j];

				if (firstNum > secNum) {
					int tempNum = firstNum;
					numbers[i] = secNum;
					numbers[j] = tempNum;
				}
			}
		}
		return;
	}

	public static void printMaxAndMin(int[] numbers, int length) {
		System.out.println("Smallest Roll : " + numbers[0]);
		System.out.println("Largest Roll : " + numbers[length - 1]);
	}

	public static void checkForSpecialCases(int[] numbers, int length) {
		int numTimesOccurred = 0;
		int counter = 1;
		int previousNum = numbers[0];

		for (int i = 1; i < length; ++i) {
			int num = numbers[i];
			if (num == previousNum) {
				++counter;
			}
			else {
				if (counter > numTimesOccurred) {
					numTimesOccurred = counter;
				}
				counter = 1;
				previousNum = num;
			}
		}
		if (counter > numTimesOccurred) {
			numTimesOccurred = counter;
		}
		printSpecialCases(numTimesOccurred);
	}

	public static void printSpecialCases(int numTimesOccurred) {
		switch (numTimesOccurred) {
			case 4:
				System.out.println("Go to Vegas!");
				break;
			case 3:
				System.out.println("Three of a kind.");
				break;
			default:
				System.out.println("Not so lucky.");
				break;
		}
	}

	public static void main(String[] args) {
		Scanner scnr = new Scanner(System.in);
		int seed = scnr.nextInt();
		System.out.println("Seed : " + seed);

		final int NUM_RANDOM_INTEGERS = 4;	// number of iterations
		final int NUM_GEN_RANGE = 6;		// range for number generator

		int[] generatedNumbers = new int[NUM_RANDOM_INTEGERS];
		Random numGen = new Random();
		if (seed > 0) {
			numGen.setSeed(seed);
		}

		for (int i = 0; i < NUM_RANDOM_INTEGERS; ++i) {
			int generatedNum = numGen.nextInt(NUM_GEN_RANGE) + 1;
			generatedNumbers[i] = generatedNum;
			System.out.println("Roll " + (i + 1) + " : " + generatedNum);
		}

		sortArray(generatedNumbers, NUM_RANDOM_INTEGERS);
		printMaxAndMin(generatedNumbers, NUM_RANDOM_INTEGERS);
		checkForSpecialCases(generatedNumbers, NUM_RANDOM_INTEGERS);
		return;
	}
}
