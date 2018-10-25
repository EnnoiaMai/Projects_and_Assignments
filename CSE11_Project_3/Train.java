/** Train class
 * Name: Thuc Nguyen
 * Cse11_Winter_2017
 * @author Thuc Nguyen
 * @version 21 February 2017
 */
import java.util.ArrayList;

public class Train {
    private Loader loader;
    private ArrayList<TrainCar> trainCars;

    /** Constructor
     * @param loadMaster - any object that implements the Loader interface.
     *                     a null reference results in runtime errors and 
     *                     does not need to be checked.
     */
    public Train(Loader loadMaster) {
    	loader = loadMaster;
	    trainCars = new ArrayList<TrainCar>();
    }

    /** Getter - Return the number of TrainCars in this Train
     * @return  how many TrainCars have been added to this Train
     */
    public int getNumCars(){
	    return trainCars.size();
    }


    /** Getter -  Return the total weight of all cargo in all TrainCars 
     * @return  total weight of cargo, summed over all TrainCars
     */ 
    public double getWeight(){
	    double weightToReturn = 0;
	    for (TrainCar c : trainCars) {
	        weightToReturn += c.getWeight();
	    }
	    return weightToReturn;
    }

    /** Getter - Return the weight of all cargo in a particular TrainCar 
     * @param car  car number starting from 0
     * @return  weight of TrainCar indicated by car. Return 0 if car 
     *           number does not exist	
     */ 
    public double getWeight(int car){
	    if ( (car >= trainCars.size()) || (car < 0) ) { 
            return 0;
        }
	    double weightToReturn = trainCars.get(car).getWeight();
	    return weightToReturn;
    }

    /** Getter - 2D array of Items that lists all cargo
     * @return 2D array of Items contained in each TrainCar. Row index
     *         is the car#.
     *    
     */
    public Item [][] getContents(){
	    int max = findMaxItemsAmongCars();

        // If max is 0, then return empty 2D array
        if (max == 0) {
            return new Item[0][0];
        }

	    Item[][] listToReturn = new Item[trainCars.size()][max];
	    for (int i = 0; i < trainCars.size(); ++i){
	        Item[] itemList = trainCars.get(i).getContents();

	        for (int j = 0; j < itemList.length; ++j){
		        listToReturn[i][j] = itemList[j];
	        }
	    }
	    return listToReturn;
    }

    private int findMaxItemsAmongCars(){
        if (trainCars.size() <= 0) {
            return 0;
        }

	    int max = trainCars.get(0).getContents().length;
	    for (int i = 1; i < trainCars.size(); ++i){
		    if ( trainCars.get(i).getContents().length > max ){
		        max = trainCars.get(i).getContents().length;
		    }
	    }
	    return max;
    }

    /** Getter - 1D array of Items that lists all cargo of a particular 
     *           TrainCar
     * @param car car number starting from 0 
     * @return 1D array of Items contained in the specif TrainCar. 
     *         If car number does not exist, return null.
     */
    public Item [] getContents(int car){
	    if ( (car < 0) || (car >= trainCars.size()) ) { 
            return null;
        }
	    return trainCars.get(car).getContents();
    }	

    /** Getter - Return TrainCar reference for specific car #
     * @param car car number starting from 0 
     * @return reference to the TrainCar instance at car index 
     *         If car number does not exist, return null.
     */
    public TrainCar getTrainCar(int car){
	    if ( (car < 0) || (car >= trainCars.size()) ){ 
            return null;
        }
	    return trainCars.get(car);
    }

    /** Add TrainCars to the Train, all with identical capacity
     * @param nCars  how many to add. Must be positive
     * @param maxWeight cargo capacity of the TrainCars to be added. 
     *                  Must be nonnegative
     *
     * <p> cars are numbered sequentially from 0.  The Nth car added has
     * index (N-1). (array ordering). addCars may be invoked any number 
     * of times.
     */
    public void addCars(int nCars, double maxWeight){
	    if ( (nCars <= 0) || (maxWeight < 0) ){ 
            return;
        }
	    for (int i = 0; i < nCars; ++i){
	        trainCars.add(new TrainCar(maxWeight));
	    }
    }

    /** load item onto train
     *  @param item any object that implements Item
     *  @return 0/1. 0 if it could not load, 1 if it loads. 
     *          returns 0 if item is null. 
     *  
     *  <p>
     *  This method uses the Loader to determine which car in which
     *  to load an item. The loader might return Loader.NOCAR 
     *  If a valid car index is returned by the Loader, then this 
     *  method loads the item into the specific car.
     *   
     */
    public int load(Item item){
	    if (item == null){ 
            return 0;
        }

	    TrainCar[] arrayOfTrainCars = toTrainCarArray();
	    int carIndex = loader.chooseCar(arrayOfTrainCars, item);
	    if (carIndex != (-1) ){
	        trainCars.get(carIndex).load(item);
            return 1;
	    }
	    return 0;
    }
    private TrainCar[] toTrainCarArray(){
	    TrainCar[] arrayToReturn = new TrainCar[trainCars.size()];
	    for (int i = 0; i < trainCars.size(); ++i){
	        arrayToReturn[i] = trainCars.get(i);
	    }
	    return arrayToReturn;
    }
    /** Convenience wrapper method around load
     *  @param qty number of items to load
     *  @param item any object that implements Item
     *  @return number of items successfully loaded [0..qty]
     *          returns 0 if item is null
     */
    public int load(int qty, Item item){
	    if (item == null){
            return 0; 
        }

	    int qtyPassed = 0;
	    for (int i = 0; i < qty; ++i){
	        int loadReturn = load(item);
	        if (loadReturn == 1){
                qtyPassed += 1;
            }
	    }
	    return qtyPassed;
    }
}
// vim: ts=4:sw=4:et
