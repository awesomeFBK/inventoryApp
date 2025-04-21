import { smallSlots, mediumSlots, largeSlots, tinySlots} from "./logic.js"
import { getSlotClassification } from "./slots.js"
//classifier function 
//do a re-read of this/review eventually pls
export function classify(newItem){
    console.log("running classify")
    console.log(newItem.classification)
    //large slots
    if (newItem.classification == "large" && largeSlots.currentSize < largeSlots.maxSize) {
        largeSlots.items.push(newItem)                
        newItem.id = largeSlots.currentSize
        largeSlots.currentSize++
        return
    } 
    //med slots
    else if (newItem.classification == "medium" && (largeSlots.currentSize < largeSlots.maxSize || mediumSlots.currentSize < mediumSlots.maxSize)) {   
        //if medium is taken up, ask if they wanna take a large slot
        if (mediumSlots.currentSize == mediumSlots.maxSize){
            console.log("add to large slot?")
            largeSlots.items.push(newItem)
            newItem.id = largeSlots.currentSize
            largeSlots.currentSize++
            return
        }

        mediumSlots.items.push(newItem)  
        newItem.id = mediumSlots.currentSize 
        mediumSlots.currentSize++ 
        return
    } 
    //small slots
    else if (newItem.classification == "small" && (largeSlots.currentSize < largeSlots.maxSize|| mediumSlots.currentSize < mediumSlots.maxSize ||
        smallSlots.currentSize < smallSlots.maxSize)) {
                       
        //if small is taken up, check for med, and then check for large
        if (smallSlots.currentSize == smallSlots.maxSize && mediumSlots.currentSize != mediumSlots.maxSize){
            console.log("add to medium slot?") //add confirmation for this 
            mediumSlots.items.push(newItem)
            newItem.id = mediumSlots.currentSize
            mediumSlots.currentSize++
            return
        }
        else if (smallSlots.currentSize == smallSlots.maxSize && mediumSlots.currentSize == mediumSlots.maxSize){
            console.log("add to large slot?")
            largeSlots.items.push(newItem)
            newItem.id = largeSlots.currentSize
            largeSlots.currentSize++
            return
        }
        
        smallSlots.items.push(newItem) 
        newItem.id = smallSlots.currentSize
        smallSlots.currentSize++
        return
    } 
    //tiny slots
    else if (newItem.classification == "tiny") {
        tinySlots.items.push(newItem)       
        newItem.id = tinySlots.currentSize
        tinySlots.currentSize++
        
        return         
    } 
    //inventory full
    else {
        console.error("full inventory!/error")
        return
    }              
}

export class Item{
    constructor(name, classification, description) {
        this.name = name
        this.classification = classification
        this.description = description
        this.id = -1

    }
    
    renderItem(containerID){
        console.log("Rendering Item:", this.name);
        //creates the div for the item
        let itemDiv = document.createElement("div")//create the div that holds the data
        itemDiv.classList.add("itemDiv")
        itemDiv.dataset.id = this.id
        itemDiv.dataset.classification = this.classification
    
        let name = document.createElement("p")//creates a paragraph for the name
        let description = document.createElement("p")//create the paragraph for description
        
        name.classList.add("edit-element")
        description.classList.add("edit-element")
    
        //creates the edit boxes that will be hidden
        let editName = document.createElement("input")
        let editDescription = document.createElement("input")
    
        //edit button
        let editButton = document.createElement("button")
        editButton.innerText = "EDIT"
        editButton.classList.add("edit-element")

        //save edit button
        let saveEditButton = document.createElement("button")
        saveEditButton.innerText = "SAVE EDIT"
        saveEditButton.classList.add("hidden", "edit-element")
        
        //checkbox for remove item
        let removeItemCheckbox = document.createElement("input") //create the checkbox for removing data
        removeItemCheckbox.type = "checkbox"
        removeItemCheckbox.classList.add("hidden", "remove-element", "remove-checkbox")
        console.log("found", removeItemCheckbox)

        //shit that is displayed
        name.innerText = this.name
        description.innerText = this.description
    
        //initializes the values of the edit boxes and hides em
        editName.value = this.name
        editDescription.value = this.description
        editName.classList.add("hidden", "edit-element")
        editDescription.classList.add("hidden", "edit-element")

        function toggleEdit(){
            let parentDiv = editButton.closest(".itemDiv")
            parentDiv.querySelectorAll(".edit-element").forEach(element => {
                element.classList.toggle("hidden")
            });
        }

        //onclick of edit button
        editButton.addEventListener("click", function() {
            toggleEdit(editButton)
        })

        saveEditButton.addEventListener("click", function(){
            saveEdit()
        })
       
        //edit item.addEventListener
        editName.addEventListener("keypress", function (event){
            if (event.key === "Enter"){
                saveEdit()
            } 
        })
        editDescription.addEventListener("keypress", function (event){
            if (event.key === "Enter"){
                saveEdit()
            } 
        })
    
        function saveEdit(){
            name.innerText = editName.value
            description.innerText = editDescription.value
            toggleEdit()
        }
    
        //append yo shit
        itemDiv.appendChild(name)
        itemDiv.appendChild(description)
        itemDiv.appendChild(editName)
        itemDiv.appendChild(editDescription)
        itemDiv.appendChild(editButton)
        itemDiv.appendChild(saveEditButton)
        itemDiv.appendChild(removeItemCheckbox)
        //edit this so that it gets the element of the container
        document.getElementById(containerID).appendChild(itemDiv)
    }


}

export const emptyItem = new Item("Empty Slot", "tiny", "An empty slot.")

export class CoinPouch{
    constructor() {
        this.goldCoins = 0
        this.silverCoins = 0
        this.copperCoins = 0
    }

    //add money

    //convert money auto function when money is added or subtracted

    //lower money 
}

//the eddit button make it work