/** RoundRobinLoader class
 * Name: Thuc Nguyen
 * Cse11_Winter_2017
 * @author Thuc Nguyen
 * @version 21 February 2017
 */

public class RoundRobinLoader implements Loader {
    private int lastCarIndex = 0;

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

	int numberOfCars = cars.length;
	int count = 0;
	int i = lastCarIndex;
	while (count < numberOfCars){
	    int iModulo = i % numberOfCars;
	    if (cars[iModulo].canLoad(item)){
		lastCarIndex = (iModulo + 1) % numberOfCars;
		return iModulo;
	    }
	    count += 1;
	    ++i;
	}

	return Loader.NOCAR; // No car found
    }
}
