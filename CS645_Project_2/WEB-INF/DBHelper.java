/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

import java.io.*;
import java.text.*;
import java.sql.*;
import java.util.*;
import java.lang.*;

/*
* Helper class for Java database connections
* Taken from Professor Riggin's demo.
*
* runQuery() - returns a vector of string arrays. Each string array is a
*           record returned from the query, with each element being the value
*           for the fields.
* doQuery() - returns a serialized string of each record returned from the query.
*           Each record is separated using '||' while each field of the record is
*           separated using '|'.

*/
public class DBHelper implements java.io.Serializable {
    // FIELDS
    private static String connectionURL = "";
    private static Connection connection = null;
    private static PreparedStatement preparedStatement = null;
    private static Statement statement = null;
    private static ResultSet resultSet = null;

    // EMPTY CONSTRUCTOR
    public DBHelper() {
    }

    public static Vector<String[]> runQuery(String query) {
        String answer = "";
        Vector<String []> answerVector = null;

    	try {
        	Class.forName("com.mysql.jdbc.Driver").newInstance();
        	connection = DriverManager.getConnection(connectionURL);
        	statement = connection.createStatement();
        	resultSet = statement.executeQuery(query);

            ResultSetMetaData rsmd = resultSet.getMetaData();
            answerVector = new Vector<String []>();

    	    while(resultSet.next()) {
                String [] row = new String[rsmd.getColumnCount()];
                for(int i = 0; i < rsmd.getColumnCount(); i++) {
                    row[i] = resultSet.getString(i + 1);
                }
                answerVector.add(row);
    		}
    	}
    	catch(Exception error) {
    	    error.printStackTrace();
    	}

        // The finally clause always runs, and closes resources if open.
        finally {
            try {
                if(resultSet != null) {
                    resultSet.close();
                }
                if(statement != null) {
                    statement.close();
                }
                if(connection != null) {
                    connection.close();
                }
            }
            catch (SQLException error) {
                answer += error;
            }
        }
        return answerVector;
    }

    public static String doQuery(String s) {
        String answer = "";
        try {
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            connection = DriverManager.getConnection(connectionURL);
            statement = connection.createStatement();
            resultSet = statement.executeQuery(s);
            ResultSetMetaData rsmd = resultSet.getMetaData();

            while(resultSet.next()) {
                int columns = rsmd.getColumnCount();

                for(int i = 1; i <= columns; i++) {

                    switch (rsmd.getColumnType(i)) {
                        case Types.CHAR:
                        case Types.VARCHAR:
                            answer += resultSet.getString(i);
                            break;
                        case Types.DECIMAL:
                            answer += String.format("%.2f", resultSet.getBigDecimal(i).doubleValue());
                            break;
                        case Types.INTEGER:
                            answer += resultSet.getInt(i);
                            break;
                        default:
                            break;
                    }
                    if (i < columns) {
                        answer += "|";
                    }
                }
                answer += "||";
            }
            // Take off '||' at end. Fails if no result set returned from query, but
            // expected to always have at least one record returned.
            answer = answer.substring(0, answer.length() - 2);
        }
        catch(Exception error) {
            error.printStackTrace();
            return error.toString();
        }
        // The finally clause always runs, and closes resources if open.
        finally {
            try {
                if(resultSet != null) {
                    resultSet.close();
                }
                if(statement != null) {
                    statement.close();
                }
                if(connection != null) {
                    connection.close();
                }
            }
            catch(SQLException error) {
                answer += error;
            }
       }
       return answer;
   }

    public static String runUpdate(String query) {
        String answer = "";

        try {
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            connection = DriverManager.getConnection(connectionURL);
            preparedStatement = connection.prepareStatement(query);
            preparedStatement.executeUpdate();

            // ResultSetMetaData rsmd = resultSet.getMetaData();
            answer = "ok";
        }
        catch(Exception error) {
            error.printStackTrace();
            answer = "error - DBHelper query, query is: " + query + "\nerror is: " + error.toString();
        }
        finally {
            try {
                if(resultSet != null) {
                    resultSet.close();
                }
                if(statement != null) {
                    statement.close();
                }
                if(connection != null) {
                    connection.close();
                }
            }
            catch (SQLException error) {
                answer = "error -  DBHelper close connection";
            }
        }
        return answer;
    }

    public static Vector<String[]> runSearch(String searchTerm) {
        String answer = "";
        Vector<String []> answerVector = null;

    	try {
            // StringBuffer buffer = new StringBuffer("SELECT sku, manufacturerID, vendor.name, category.name, description, retail, quantity, image FROM product, vendor, category WHERE product.venID = vendor.id AND product.catID = category.id AND (manufacturerID LIKE '%?%' OR vendor.name LIKE '%?%' OR category.name LIKE '%?%' OR description LIKE '%?%');");
            StringBuffer buffer = new StringBuffer("SELECT sku, manufacturerID, vendor.name, category.name, description, retail, quantity, image FROM product, vendor, category WHERE product.venID = vendor.id AND product.catID = category.id AND (manufacturerID LIKE '%" + searchTerm + "%' OR vendor.name LIKE '%" + searchTerm + "%' OR category.name LIKE '%" + searchTerm + "%' OR description LIKE '%" + searchTerm +"%');");

        	Class.forName("com.mysql.jdbc.Driver").newInstance();
        	connection = DriverManager.getConnection(connectionURL);
            statement = connection.createStatement();
            resultSet = statement.executeQuery(buffer.toString());

            // preparedStatement = connection.prepareStatement(buffer.toString());
            // preparedStatement.setString(1, searchTerm);
            // preparedStatement.setString(2, searchTerm);
            // preparedStatement.setString(3, searchTerm);
            // preparedStatement.setString(4, searchTerm);
        	// resultSet = preparedStatement.executeQuery();

            ResultSetMetaData rsmd = resultSet.getMetaData();
            answerVector = new Vector<String []>();

    	    while(resultSet.next()) {
                String [] row = new String[rsmd.getColumnCount()];
                for(int i = 0; i < rsmd.getColumnCount(); i++) {
                    row[i] = resultSet.getString(i + 1);
                }
                answerVector.add(row);
    		}
    	}
    	catch(Exception error) {
    	    error.printStackTrace();
    	}

        // The finally clause always runs, and closes resources if open.
        finally {
            try {
                if(resultSet != null) {
                    resultSet.close();
                }
                if(statement != null) {
                    statement.close();
                }
                if(connection != null) {
                    connection.close();
                }
            }
            catch (SQLException error) {
                answer += error;
            }
        }
        return answerVector;
    }
}
