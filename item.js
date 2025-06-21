import { smallSlots, mediumSlots, largeSlots, tinySlots, updateCounter, saveToStorage} from "./logic.js"
import { getSlotClassification } from "./slots.js"
import { uploadImage, uploadImageToStandard } from './utils.js';
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
        updateCounter("largeSlotCounter")
        return "large-Slots"
    } 
    //med slots
    else if (newItem.classification == "medium" && (largeSlots.currentSize < largeSlots.maxSize || mediumSlots.currentSize < mediumSlots.maxSize)) {   
        //if medium is taken up, ask if they wanna take a large slot
        if (mediumSlots.currentSize == mediumSlots.maxSize){
            let choice =confirm("medium slot is full, add to large slot?")
            if (!choice){return}
            
            console.log("add to large slot?")
            largeSlots.items.push(newItem)
            newItem.id = largeSlots.currentSize
            largeSlots.currentSize++
            updateCounter("largeSlotCounter")
            return "large-Slots"
        }

        mediumSlots.items.push(newItem)  
        newItem.id = mediumSlots.currentSize 
        mediumSlots.currentSize++ 
        updateCounter("mediumSlotCounter")
        return "medium-Slots"
    } 
    //small slots
    else if (newItem.classification == "small" && (largeSlots.currentSize < largeSlots.maxSize|| mediumSlots.currentSize < mediumSlots.maxSize ||
        smallSlots.currentSize < smallSlots.maxSize)) {
                       
        //if small is taken up, check for med, and then check for large
        if (smallSlots.currentSize == smallSlots.maxSize && mediumSlots.currentSize != mediumSlots.maxSize){
            let choice =confirm("small slot is full, add to medium slot?")
            if (!choice){return}

            console.log("add to medium slot?") //add confirmation for this  
            mediumSlots.items.push(newItem)
            newItem.id = mediumSlots.currentSize
            mediumSlots.currentSize++
            updateCounter("mediumSlotCounter")
            return "medium-Slots"
        }
        else if (smallSlots.currentSize == smallSlots.maxSize && mediumSlots.currentSize == mediumSlots.maxSize){
            let choice =confirm("small slot and medium is full, add to large slot?")
            if (!choice){return}
            console.log("add to large slot?")
            largeSlots.items.push(newItem)
            newItem.id = largeSlots.currentSize
            largeSlots.currentSize++
            updateCounter("largeSlotCounter")
            return "large-Slots"
        }
        
        smallSlots.items.push(newItem) 
        newItem.id = smallSlots.currentSize
        smallSlots.currentSize++
        updateCounter("smallSlotCounter")
        return "small-Slots"
    } 
    //tiny slots
    else if (newItem.classification == "tiny") {
        tinySlots.items.push(newItem)       
        newItem.id = tinySlots.currentSize
        tinySlots.currentSize++
        
        return "tiny-Slots"          
    } 
    //inventory full
    else {
        throw new Error("inventory is full")
    }              
}

export class Item{
    constructor(image, name, classification, description) {
        this.image = image
        this.name = name
        this.classification = classification || "none"
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
        name.innerText = this.name

        let classification = document.createElement("p")
        let classificationTemp = this.classification
        classification.innerText = classificationTemp.charAt(0).toUpperCase() + classificationTemp.slice(1)

        let description = document.createElement("p")//create the paragraph for description
        description.innerText = this.description

        //image element
        let equipImage = document.createElement("img")
        equipImage.src = this.image || "empty_icons/item.png"
        equipImage.classList.add("item-picture")

        //file input element
        let itemFileInput = document.createElement("input")
        itemFileInput.type = "file"
        itemFileInput.accept = "image/*"
        itemFileInput.style.display = "none" // Hide the file input

        //associates both in a label
        let itemLabel = document.createElement("label")
        itemLabel.appendChild(equipImage)
        itemLabel.appendChild(itemFileInput)

        //event listener for image input
        itemFileInput.addEventListener("change", (event) => {
            uploadImage(event)
                .then((base64String) => {
                    equipImage.src = base64String
                    this.image = base64String
                    saveToStorage()
                })
                .catch((error) => {
                    console.error("Error uploading image", error)
                })
        })

        name.classList.add("item-name")
        classification.classList.add("item-class")
        description.classList.add("item-desc")

        name.contentEditable = false
        description.contentEditable = false
    
        //checkbox for remove item
        let removeItemCheckbox = document.createElement("input") //create the checkbox for removing data
        removeItemCheckbox.type = "checkbox"
        removeItemCheckbox.classList.add("hidden", "remove-element", "remove-checkbox")//don't kill remove element
        console.log("found", removeItemCheckbox)

        let editButton = document.createElement("button") //create the button for editing
        editButton.innerText = "Edit"
        editButton.classList.add("edit-button")

        let saveButton = document.createElement("button") //create the button for saving
        saveButton.innerText = "Save"
        saveButton.classList.add("edit-button", "hidden")

        //onclick of edit button
        editButton.addEventListener("click", function() {
            name.contentEditable = true
            description.contentEditable = true
            editButton.classList.add("hidden")
            saveButton.classList.remove("hidden")
        })

        console.log(this.classification)
        //save edit
        saveButton.addEventListener("click", function() {
            name.contentEditable = false
            description.contentEditable = false
            editButton.classList.remove("hidden")
            saveButton.classList.add("hidden")

            let itemFind = getSlotClassification(itemDiv.dataset.classification)
            console.log(itemDiv.dataset.classification)
            console.log(itemFind)

            let item = itemFind.items.find(item => item.id == Number(itemDiv.dataset.id))
            if (item) {
                item.name = name.innerText
                item.description = description.innerText
            }
        
            saveToStorage()
        })

        let itemDivOverlay = document.createElement("div") //create the overlay for the item
        itemDivOverlay.classList.add("slot-item-overlay")        
        itemDiv.appendChild(itemDivOverlay)

        //append yo shit
        itemLabel.classList.add("item-picture")
        itemDiv.appendChild(itemLabel)
        itemDiv.appendChild(name)
        itemDiv.appendChild(classification)
        itemDiv.appendChild(description)
        itemDiv.appendChild(saveButton)
        itemDiv.appendChild(editButton)
        itemDiv.appendChild(removeItemCheckbox)
        //edit this so that it gets the element of the container
        document.getElementById(containerID).appendChild(itemDiv)
        itemDiv.classList.add("slot-item")
    }


}

export const emptyItem = new Item("", "", "tiny", "An empty slot.")

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