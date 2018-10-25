/** Electronics class
 * Name: Thuc Nguyen
 * Cse11_Winter_2017
 * @author Thuc Nguyen
 * @version 21 February 2017
 */

public class Electronics implements Item {
    private String description;
    private double weight;

    /** Constructor
     * @param description - String that gives details about the Electornic object
     * @param weight - the weight (double) to be given to the object
     */
    public Electronics(String description, double weight){
	this.description = description;
	this.weight = weight;
    }

    @Override
    public String toString(){
	return description();
    }

    public double getWeight(){
	return weight;
    }

    public String description(){
	return "Electronics: " + description + " (" + weight + " KG)";
    }
}
