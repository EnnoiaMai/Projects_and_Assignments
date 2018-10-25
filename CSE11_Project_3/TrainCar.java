/** TrainCar Class
 * Name: Thuc Nguyen
 * Cse11_Winter_2017
 * @author Thuc Nguyen
 * @version 21 Feb 2017
 */
import java.util.ArrayList;

public class TrainCar {
    private double maxWeight;
    private double totalWeight;
    private ArrayList<Item> listOfItems;

    /** Constructor
     * @param maxW - - maximum cargo weight (KG) of this TrainCar.
     *        if maxW {@literal <} = 0, then max cargo weight is 0 KG
     */
    public TrainCar(double maxW){
		maxWeight = (maxW <= 0) ? 0 : maxW ;
		totalWeight = 0;
		listOfItems = new ArrayList<Item>();
    }

    /** determine if item can be loaded in car
     * @param item - object to be tested for loading
     * @return true if item would not put this TrainCar over its maximum weight.
     *         false otherwise. Return false if item is null. Return false if item
     *         weight {@literal <}= 0.
     */
    public boolean canLoad(Item item){
		if (item == null) {
			return false;
		}
		if (item.getWeight() <= 0) {
			return false;
		}
		if ( (totalWeight + item.getWeight()) <= maxWeight){
	    	return true;
		}
		return false;
    }

    /** Return an array of Item references of what is loaded in this car
     * @return Array of items currently loaded in this car. length of array 
     *         indicates the number of items loaded. This may be a reference or
     *         a deep copy.
     */
    public Item[] getContents(){
		Item[] returnList = new Item[listOfItems.size()];
		for (int i = 0; i < listOfItems.size(); ++i){
	    	returnList[i] = listOfItems.get(i);
		}
		return returnList;
    }

    /** Getter - return maximum weight of cargo in this TrainCar
     * @return Maximum weight of cargo in this TrainCar (in KG)
     */
    public double getMaxWeight(){
		return maxWeight;
    }

    /** Determine how many of a particular Item is in this TrainCar
     * @param item - Reference to any object that implements Item
     * @return number of items in the TrainCar. null item should return 0
     */
    public int getQuantity(Item item){
		if (item == null){ 
			return 0;
		}
		int counter = 0;
		for (int i = 0; i < listOfItems.size(); ++i){
	    	if (listOfItems.get(i) == item)
			counter += 1;
		}
		return counter;
    }

    /** Getter - return current weight of cargo in this TrainCar
     * @return current weight of cargo in this TrainCar (in KG)
     */
    public double getWeight(){
		return totalWeight;
    }

    /** load an item into the TrainCar
     * @param item - any object that implements Item
     * @return 0/1. return 0 if item not loaded, 1 if loaded. returns 0 if
     *         item is null. returns 0 if canLoad would return false.
     */
    public int load(Item item){
		if (item == null){ 
			return 0;
		}
		if ( !canLoad(item) ){ 
			return 0; 
		}
		listOfItems.add(item);
		totalWeight += item.getWeight();
		return 1;
    }
    @Override
    public String toString(){
		String listOfItemsString = "";
		for (Item item : listOfItems) {
			listOfItemsString += item.description() + ", ";
		}
		return listOfItemsString;
    }
}
