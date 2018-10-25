/** FairLoader class
 * Name: Thuc Nguyen
 * Cse11_Winter_2017
 * @author Thuc Nguyen
 * @version 21 February 2017
 */

public class FairLoader implements Loader {
    /** choose which car can accomodate the item
     * @param cars Array of TrainCars
     * @param item What to load
     * @return car index in range [0..cars.size) if item fits
     *        Loader.NOCAR if item cannot be loaded.
     *        Loader.NOCAR if cars is null
     *        Loader.NOCAR if item is null
     */
    public int chooseCar(TrainCar[] cars, Item item){
		if (cars == null) return Loader.NOCAR;
		if (item == null) return Loader.NOCAR;

		double[] weights = trainCarWeights(cars);
		int minIndex = findMinIndex(cars, item, weights);
		if (minIndex == -1) { 
			return Loader.NOCAR; // No car found because can't load
		}
        return minIndex;
    }

    private double[] trainCarWeights(TrainCar[] cars){
		double[] arrayToReturn = new double[cars.length];
		for (int i = 0; i < cars.length; ++i){
	    	arrayToReturn[i] = cars[i].getWeight();
		}
		return arrayToReturn;
    }
    /* -1 is a nonsense value, which is given right at the start
     */
    private int findMinIndex(TrainCar[] cars, Item item, double[] weights){
		int index = -1;
		for (int i = 0; i < cars.length; ++i){
	    	if (cars[i].canLoad(item)){
				if (index == -1 || weights[i] < weights[index]){
		    		index = i;
				}
	    	}
		}
		return index;
    }
}
