/*==========================================================================================================
Thuc Nguyen
CS646 Fall 2017
Due September 8, 2017

                                            Assignment 1

==========================================================================================================*/


import UIKit

/*=============================================// (1) //==================================================*/
func findPalindromes(n : Int) -> Int {
    var numberOfPalindromes = 0
    
    for number in 0...n {
        
        var reverseNumber = 0
        var modifiedNumber = number
        
        while (modifiedNumber > 0){
            let remainder = modifiedNumber % 10
            reverseNumber = (reverseNumber * 10) + remainder
            modifiedNumber /= 10
        }
        if (reverseNumber == number){
            numberOfPalindromes += 1
        }
    }
    
    return numberOfPalindromes
}
/* Test Cases */
findPalindromes(n: 0) == 1
findPalindromes(n: 9) == 10
findPalindromes(n: 20) == 11
findPalindromes(n: 22) == 12
findPalindromes(n: 30) == 12
findPalindromes(n: 100) == 19
findPalindromes(n: 1000) == 109

/*=============================================// (2) //==================================================*/

func sumMultiples3_5(n : Int) -> Int {
    guard (n > 0) else {
        return 0
    }
    
    var sum = 0
    for number in 0...(n - 1) {
        if ((number % 3) == 0) && ((number % 5) == 0){
            continue
        }
        if (number % 3 == 0) || (number % 5 == 0) {
            sum += number
        }
    }
    return sum
}
/* Test Cases */
sumMultiples3_5(n: -1) == 0
sumMultiples3_5(n: 0) == 0
sumMultiples3_5(n: 1) == 0
sumMultiples3_5(n: 6) == 8
sumMultiples3_5(n: 20) == 63
sumMultiples3_5(n: 45) == 405

/*=============================================// (3) //==================================================*/
func patternCount(text : String, pattern : String) -> Int {
    var count = 0
    var index = 0
    let textLength = text.count
    let patternLength = pattern.count
    
    if (patternLength > textLength){
        print("patternCount(): patternLength is greater than textLength")
        return 0
    }
    
    while (index <= (textLength - patternLength)){
        let start = text.index(text.startIndex, offsetBy: index)
        let end = text.index(text.startIndex, offsetBy: (index + patternLength))
        let range = start..<end
        
        let textSubString : Substring = text[range]
        
        if (textSubString == pattern){
            count += 1
        }
        index += 1
    }
    return count
}
/* Test Cases */
patternCount(text: "abababa", pattern: "aba") == 3
patternCount(text: "aaaaa", pattern: "aa") == 4
patternCount(text: "Abcde", pattern:"abc") == 0
patternCount(text: "hello", pattern: "helloworld") == 0

/*=============================================// (4) //===============================================*/
func popularClasses(classSets : [Set<String>]) -> String {
    let emptyString: String = ""
    
    if (classSets.isEmpty) || (classSets.count == 1) {
        return emptyString
    }
    
    let firstSet: Set<String> = classSets[0]
    for classes in firstSet {
        var count = 1
        
        for sets in classSets[1...]{
            if sets.contains(classes){
                count += 1
            }
        }
        if (count == classSets.count){
            return classes
        }
    }
    return emptyString
}

/* Test Cases */
let studentA: Set = ["CS101", "CS237", "CS520"]
let studentB: Set = ["CS101", "Math245", "CS237"]
let studentC: Set = ["CS237", "CS560"]
popularClasses(classSets: [studentA, studentB, studentC]) == "CS237"

let fruitsA: Set = ["apple", "orange", "kiwi", "pear"]
let fruitsB: Set = ["banana", "dragonfruit", "watermelon", "apple", "pear"]
let fruitsC: Set = ["banana", "peach", "apple", "grapes"]
popularClasses(classSets: [fruitsA, fruitsB, fruitsC]) == "apple"

popularClasses(classSets: []) == ""

let randomWords: Set = ["hello", "foot", "bro"]
popularClasses(classSets: [randomWords]) == ""

/*=============================================// (5) //===============================================*/
func average(array : [Int]) -> Double? {
    if array.isEmpty {
        return nil
    }
    
    var sum: Double = 0
    for number in array {
        let numberD = Double(number)
        sum += numberD
    }
    return (sum / 2)
}
/* Test Cases */
average(array: [5, 10]) == 7.5
average(array: [0, -2]) == -1
average(array: [25000, 4]) == 12502
average(array: [0, 0]) == 0
average(array: []) == nil

/*=============================================// (6) //===============================================*/
func average2(array: [Int?]) -> Double? {
    if array.isEmpty {
        return nil
    }
    if array.contains(where: {$0 == nil}) == true {
        return nil
    }
        
    var sum: Double = 0
    for number in array {
        let numberD = Double(number!)
        sum += numberD
    }
    return (sum / 2)
}

/* Test Cases */
average2(array: [5, 10]) == 7.5
average2(array: [0, -2]) == -1
average2(array: [25000, 4]) == 12502
average2(array: [0, 0]) == 0
average2(array: []) == nil
average2(array: [1, nil]) == nil

/*=============================================// (7) //===============================================*/
func cost(dictionary : Dictionary<String, String>) -> Double {
    guard let priceValue = dictionary["price"], let quantityValue = dictionary["quantity"] else {
        print("cost(): either price or quantity is nil")
        return 0
    }

    guard let priceNum = Double(priceValue), let quantityNum = Double(quantityValue) else {
        print("cost(): either price or quantity Double value is nil")
        return 0
    }
    return priceNum * quantityNum
}
/* Test Cases */
let iceCreamA = ["name":"Mochie Green Tea", "quantity":"2", "price":"2.3"]
let iceCreamB = ["name":"Mochie Green Tea", "price":"2.3"]
cost(dictionary: iceCreamA) == 4.6
cost(dictionary: iceCreamB) == 0

let groceriesA = ["name":"Oranges", "quantity":"5", "price":"1"]
let groceriesB = ["name":"Oranges", "quantity":"5"]
let groceriesC = ["name":"Peanut Butter", "price":"", "quantity":"2"]
let groceriesD = ["name":"Peanut Butter", "price":"5z", "quantity":"4"]
cost(dictionary: groceriesA) == 5
cost(dictionary: groceriesB) == 0
cost(dictionary: groceriesC) == 0
cost(dictionary: groceriesD) == 0

/*=============================================// (8) //===============================================*/
func wordCount(words: String, minimum: Int) -> Dictionary<String, Int> {
    let wordsArray = words.components(separatedBy: " ")
    
    var dictionary = [String: Int]()
    
    for word in wordsArray {
        
        if (dictionary.keys.contains(word)){
            if var number = dictionary[word]{
                number += 1
                dictionary[word] = number
            }
        }
        else {
            dictionary[word] = 1
        }
    }
    for (key, value) in dictionary {
        if (value < minimum){
            dictionary.removeValue(forKey: key)
        }
    }
    return dictionary
}
/* Test Cases */
wordCount(words: "cat bat cat rat mouse bat", minimum: 1) == ["cat": 2, "bat": 2, "rat": 1, "mouse": 1]
wordCount(words: "cat bat cat rat mouse bat", minimum: 2) == ["cat": 2, "bat": 2]
wordCount(words: "cat bat cat rat mouse bat", minimum: 3) == [:]

/*=============================================// (9) //===============================================*/
func wordCount2(words: String, minimum: Int = 2) -> Dictionary<String, Int>{
    let wordsArray = words.components(separatedBy: " ")
    
    var dictionary = [String: Int]()
    
    for word in wordsArray {
        
        if (dictionary.keys.contains(word)){
            if var number = dictionary[word]{
                number += 1
                dictionary[word] = number
            }
        }
        else {
            dictionary[word] = 1
        }
    }
    for (key, value) in dictionary {
        if (value < minimum){
            dictionary.removeValue(forKey: key)
        }
    }
    return dictionary
}
/* Test Cases */
wordCount2(words: "cat bat cat rat mouse bat") == ["cat": 2, "bat": 2]
wordCount2(words: "cat bat cat rat mouse bat", minimum: 3) == [:]

/*=============================================// (10) //==============================================*/
func wordCount3(minimum : Int) -> (String) -> Dictionary<String, Int> {
    
    func wordCountReturn(words: String) -> Dictionary<String, Int> {
        let wordsArray = words.components(separatedBy: " ")
    
        var dictionary = [String: Int]()
    
        for word in wordsArray {
        
            if (dictionary.keys.contains(word)){
                if var number = dictionary[word]{
                    number += 1
                    dictionary[word] = number
                }
            }
            else {
                dictionary[word] = 1
            }
        }
        for (key, value) in dictionary {
            if (value < minimum){
                dictionary.removeValue(forKey: key)
            }
        }
        return dictionary
    }
    
    return wordCountReturn
}
/* Test Cases */
let testA = wordCount3(minimum: 2)
testA("cat bat cat rat mouse bat") == ["cat": 2, "bat": 2]
testA("a a a b c c") == ["a": 3, "c": 2]
let testB = wordCount3(minimum: 3)
testB("a a a b c c") == ["a": 3]


