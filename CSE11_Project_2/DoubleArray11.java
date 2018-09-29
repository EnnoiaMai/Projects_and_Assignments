/**
 * Provide a set of Array functions on an Array of doubles 
 * @author Thuc Nguyen
 * @version CSE11-Winter2017-PR2
 */
public class DoubleArray11
{
    public final int EXPANSION=10;
    // This is internal array where you store double values
    private double [] internal;
    
    // This is the number of filled (utilized slots in the array)
    // internal.length may be > size.  
    // only indices 0..(size-1) store "active" elements
    private int size;

    // You may want to add other instance variables here.
    private static int nArrays = 0;

    /** 
      * 0-argument constructor. 
     * initial capacity of internal double array is set to 0
    */
    public DoubleArray11()
    {
        // FILL ME IN!
	internal = new double[0];
	size = 0;
	nArrays += 1;
    }

    /** 
      * create an instance where the internal storage has a capacity to
      * to store upto capacity doubles 
      * @param capacity initial capacity of this instance 
    */
    public DoubleArray11(int capacity)
    {
        // FILL ME IN!
	internal = new double[capacity];
	size = 0;
	nArrays += 1;
    }

    /** 
      * Create the internal array to be the same size as the argument 
      * copy element-by-element the argument array to internal 
      * @param dArray array of elements to copy 
    */
    public DoubleArray11(double [] dArray)
    {
        // FILL ME IN!
	//	size = dArray.length; //size or length?
	size = dArray.length;
	internal = new double[dArray.length];
	for (int i = 0; i < dArray.length; ++i){
	    internal[i] = dArray[i];
	}
	nArrays += 1;
    }

    /* Make a string representation */
    /**
     * Pretty Print  -- Empty String "[]"
     *                  else "[e1, e2, ..., en]"
     *                  only print the first size elements
     */
    @Override
    public String toString()
    {
        // note: String s = String.format("%6.3g",x); will produce a string
        // that prints a formatted version of the double variable x.
        String s = "[";
        int i;
        for (i = 0; i < size-1; i++)
            s += String.format("%6.3g, ",internal[i]);
        if (i == (size -1))
            s += String.format("%6.3g",internal[i]);
        s += "]";
            
        return s;
    }

    /* Getters and Setters */

    /** get the number of elements actually stored in the internal array  
     *  e.g. internal variable size
     * @return number of elements in the array
    */
    public int getSize()
    {
        // FILL ME IN!
        return size;
    }
    /** get the capacity of the  internally stored array  
     * @return capacity of the internally-stored array 
    */
    public int getCapacity()
    {
        // FILL ME IN!
        return internal.length;
    }
    /** get the Element at index  
     * @param index of data to retrieve. Valid index is 0..(size-1) 
     * @return element if index is valid else  return Double.NaN
    */
    public double getElement(int index)
    {
        // FILL ME IN!
	if ( (index >= 0) && (index <= (size - 1)) && (size > 0) && (internal != null) ){
	    return internal[index];
	}
	else {
	    return Double.NaN;
	}
    }
    
    /** Determine how many DoubleArray11 Objects have been constructed 
     * @return the number of times any of the constructors have been called 
    */
    public static int getNArrays()
    {
        // FILL ME IN!
        return nArrays;
    }

    /** retrieve a copy of the internal stored Array
     * @return an array has length == size. The elements in the array
     * should be copies of the first size elements of the internal array.
     * (this is called a deep copy)
    */
    public double [] getArray()
    {
        // FILL ME IN!
        double[] toReturn = new double[size];
	for (int i = 0; i < size; ++i){
	    toReturn[i] = internal[i];
	}
        return toReturn;
    }

    /** set the value of an element in the stored arra
     * @param index of element to store. Must be a valid index  [0,(size-1)]
     * @param element the data to insert in the array
     * @return true if element set was successful. false if the index is out
     * of range
     * 
    */
    public boolean setElement(int index, double element)
    {
        // FILL ME IN!
	if ( (index >= 0) && (index <= (size - 1)) && (size > 0) && (internal != null) ){
	    internal[index] = element;
	    return true;
	}
	else {
	    return false;
	}
    }

    /** Append element at the "end" of the array. That is, at index = size 
     * @param element the data to append to the array
     * @return true if element insertion was successful
     * if the internal array has no more capacity, then create a new internal
     * array with capacity expanded by  EXPANSION slots.
    */
    public boolean append(double element)
    {
        // FILL ME IN!
	if (internal != null){
	    if ( (internal.length <= size) || (size == 0) ){
		internal = newExpandedArray(size + EXPANSION);
	    }
	    internal[size] = element;
	    size += 1;
	    return true;
	}
	else {
	    return false;
	}
    }

    /** Delete an element at index.
     * @param index of element to delete. Index in range [0..(size-1)]
     * @return true if element deletion was successful, false otherwise
    */
    public boolean delete(int index)
    {
        // FILL ME IN!
	if ( (index >= 0) && (index <= (size - 1)) && (size > 0) && (internal != null) ){
	    internal = newDeletedArray(index);
	    return true;
	}
	else {
	    return false;
	}
    }

    /** Insert an element at index in the array
     * @param index where to insert. index in range [0,size] 
     *              Inserting at index size  is equivalent to append
     *              expand capacity of internal array by EXPANSION slots if
     *              needed
     * @param element the data to insert in the array
     * @return true if element insertion was successful
    */
    public boolean insert(int index, double element)
    {
        // FILL ME IN!
	if ( (index >= 0) && (index <= size) && (internal != null) ){
	    if ( (size == 0) || (index == size) ){
		append(element);
		return true;
	    }
	    else {
		if (size == internal.length){
		    internal = newExpandedArray(size + EXPANSION);
		}
		internal = newInsertedArray(index, element);
		return true;
	    }
	}
	else {
	    return false;
	}
    }



    /** reverse the order of the first size elements in internal array 
    *   <pre>
    *   Example:  internal = [ 1,2,3,4,5,6,7,8,0,0 ]
    *             with size = 8
    *             reverse() results in 
    *             Array = [ 8,7,6,5,4,3,2,1,0,0]
    *   </pre>
    */
    public void reverse()
    {
        // FILL ME IN!
	for (int i = 0; i < (size / 2); ++i){
	    double temp = internal[i];
	    internal[i] = internal[(size - 1) - i];
	    internal[(size - 1) - i] = temp;
	}
    }

    /** reverse the order of the elements in the array from start to
     *   to end index 
     *   <p>
     *   start may be larger,smaller, or equal to end. The indices are
     *   inclusive. Valid indices are [0,(size-1)]
    *   <pre>
    *   Example:  Array = [ 1,2,3,4,5,6,7,8 ]
    *             reverse(3,6) results in 
    *             Array = [ 1,2,3,7,6,5,4,8 ]
    *   </pre>
    *   @param start beginning index of to start the reverse
    *   @param end    ending index to end the reverse
    *   @return true if start and end index are valid, false otherwise
    *
    *
    */
    public boolean reverse(int start, int end)
    {
        // FILL ME IN!
	if ( (start >= 0) && (start <= (size - 1)) && (end >= 0) && (end <= (size - 1)) && (size > 0) && (internal != null) ) {
	    // If size is only one, or the start and end indices are the same, return true without changes
	    if ( (size == 1) || (start == end) ){ return true; }
	    // Sort so that the smaller number index is at start
	    int startIndex = 0;
	    int endIndex = 0;
	    if (start <= end){
		startIndex = start;
		endIndex = end;
	    }
	    else {
		startIndex = end;
		endIndex = start;
	    }
	    // Range is relative
	    int rangeSize = ((endIndex - startIndex) + 1);
	    for (int i = startIndex; i < (startIndex + (rangeSize / 2)); ++i){
		double temp = internal[i];
		internal[i] = internal[endIndex - (i - startIndex)];
		internal[endIndex - (i - startIndex)] = temp;
	    }
	    return true;
	}
	else {
	    return false;
	}
    }

    /** swap two elements in the array 
    *   @param index1 index of first element 
    *   @param index2 index of second element
    *   @return true if index1 and index2 are valid, false otherwise
    *
    */
    public boolean swap(int index1, int index2)
    {
        // FILL ME IN!
	if ( (index1 >= 0) && (index1 < size) && (index2 >=0) && (index2 < size) && (size > 1) && (internal != null) ){
	    if (index1 == index2){ return true; }
	    double tempValue = internal[index1];
	    internal[index1] = internal[index2];
	    internal[index2] = tempValue;
	    return true;
	}
	else {
	    return false;
	}
    }

    /** minimum value of first size elements
     * @return the minimum value of the first size elements of the 
     *  internal array. if no elements, return Double.NaN
    */
    public double min()
    {
        // FILL ME IN!
	if (size > 0){
	    double minimum = internal[0];
	    for (int i = 1; i < size; ++i){
		if (internal[i] < minimum){
		    minimum = internal[i];
		}
	    }
	    return minimum;
	}
	else {
	    return Double.NaN;
	}
    }


    /** maximum value of first size elements 
     *  @return the max value of the first size elements of the 
     *  internal array. if no elements, return Double.NaN
    */
    public double max()
    {
        // FILL ME IN!
	if (size > 0){
	    double maximum = internal[0];
	    for (int i = 1; i < size; ++i){
		if (internal[i] > maximum){
		    maximum = internal[i];
		}
	    }
	    return maximum;
	}
	else {
	    return Double.NaN;
	}
    }

    // Private Helper Methods //
    private double[] newExpandedArray(int newSize){
	double[] expandedArray = new double[newSize];
	for (int i = 0; i < size; ++i){
	    expandedArray[i] = internal[i];
	}
	return expandedArray;
    }
    private double[] newDeletedArray(int index){
	double[] deletedArray = new double[size];
	for (int i = 0; i < size; ++i){
	    if (i == index){
		continue;
	    }
	    else if (i > index){
		deletedArray[i - 1] = internal[i];
	    }
	    else {
		deletedArray[i] = internal[i];
	    }
	}
	size -= 1;
	return deletedArray;
    }
    private double[] newInsertedArray(int index, double element){
	double[] insertedArray = new double[size + 1];
	for (int i = 0; i < (size + 1); ++i){
	    if (i == index){
		insertedArray[i] = element;
	    }
	    else if (i > index){
		insertedArray[i] = internal[i - 1];
	    }
	    else {
		insertedArray[i] = internal[i];
	    }
	}
	size += 1;
	return insertedArray;
    }


}
// vim: ts=4:sw=4:tw=78:et
