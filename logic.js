import {Item, classify} from './item.js'
import { getSlotClassification, Slots, addItem, removeItem, StandardSlots} from './slots.js';

//global values for the slots
export let smallSlots  = new Slots(0), mediumSlots  = new Slots(0), largeSlots = new Slots(0), 
tinySlots = new Slots(0), standardSlots = new StandardSlots(5)


//global value for strength modifier
let strengthModifier = 0
let playerName = ""

//function to give max slots here
//hardcoded
function calculateSlots(){
    //edge cases
    let smallSlotsSize = 0, mediumSlotsSize = 0, largeSlotsSize = 0

    if (strengthModifier == -1){
        smallSlotsSize = 4, mediumSlotsSize = 1 //4 small slots, 1 medium slot
    }
    else if (strengthModifier < -1 && strengthModifier >= -5){
        smallSlotsSize = 5 + (strengthModifier)
    }
    else {
        smallSlotsSize = 5 + (strengthModifier * 5)
        mediumSlotsSize = 3 + (strengthModifier * 2)
        largeSlotsSize = 1 + ((Math.floor(strengthModifier/2) * 1)) 
    }

    //change max sizes of the different slots
    smallSlots.maxSize = smallSlotsSize
    mediumSlots.maxSize = mediumSlotsSize
    largeSlots.maxSize = largeSlotsSize
    tinySlots.maxSize = 200 //change this if needed

    console.log(largeSlots.items)

}

//loads the json file
function loadJson(event){
    const file = event.target.files[0]
    if (!file){
        console.log("file not loaded properly lol")
        return
    }    

    //creates an instance of a reader using the FileReader API
    const reader = new FileReader() 

    //when the reader loads everything, the loadAll function starts workin.
    reader.onload = async function(event) {
        try {
            console.log("shit was loaded goated")
            const jsonData = JSON.parse(event.target.result)
            await loadAll(jsonData) 
        } 
        catch (error) {
            console.error("Invalid JSON file", error)
        }
    }

    //reads the text file then passes it onto reader.onload when its done reading 
    reader.readAsText(file)

}

//loads the items and sends them into the classification function
async function loadAll(jsonFile){
    try {
        console.log("items are now being loaded into the different slots")

        //inputs the player name and strength modifier
        playerName = jsonFile.player.name
        console.log("Json player name is:" + jsonFile.player.name)
        console.log("Player name is:" + playerName)
        strengthModifier = jsonFile.player.strengthModifier
        console.log("strength modifier is" + strengthModifier)
        console.log("json strength modifier is " + jsonFile.player.strengthModifier)

        
        document.getElementById("playerName").innerText = playerName
        if (strengthModifier < 0){
            document.getElementById("strengthModifierDisplay").innerText = ("-" + strengthModifier)
        }
        else {
            document.getElementById("strengthModifierDisplay").innerText = ("+" + strengthModifier)
        }


        //clears the slots
        clearSlots()

        //calculates current slots
        calculateSlots()

        if (jsonFile.player.rangedWeaponFlag == false){
            smallSlots.maxSize += 2
        }

        //populates standard slots
        loadStandard(jsonFile)

        //populates item slots
        loadItems(jsonFile)
        
        //renders all menus
        standardSlots.renderStandardSlots("standardSlots")
        largeSlots.renderAllItems("large-Slots")
        mediumSlots.renderAllItems("medium-Slots")
        smallSlots.renderAllItems("small-Slots")
        tinySlots.renderAllItems("tiny-Slots")
    }
    catch(error){
        console.log("error reading file gng", error)
    }
}

function loadItems(jsonFile){
    //could be optimized but ong who cares
    jsonFile.items.largeSlots.forEach(obj => {
        const newItem = new Item(obj.name, obj.classification, obj.description)
        largeSlots.items.push(newItem)
        newItem.id = largeSlots.currentSize
        largeSlots.currentSize++
    })
    jsonFile.items.mediumSlots.forEach(obj => {
        const newItem = new Item(obj.name, obj.classification, obj.description)
        mediumSlots.items.push(newItem)
        newItem.id = mediumSlots.currentSize
        mediumSlots.currentSize++
    })
    jsonFile.items.smallSlots.forEach(obj => {
        const newItem = new Item(obj.name, obj.classification, obj.description)
        smallSlots.items.push(newItem)
        newItem.id = smallSlots.currentSize
        smallSlots.currentSize++
    })
    jsonFile.items.tinySlots.forEach(obj => {
        const newItem = new Item(obj.name, obj.classification, obj.description)
        tinySlots.items.push(newItem)
        newItem.id = tinySlots.currentSize
        tinySlots.currentSize++
    })
}

function loadStandard(jsonFile){
    standardSlots.armorSlot = jsonFile.standardSlots.armorSlot
    standardSlots.mainHand = jsonFile.standardSlots.mainHand
    standardSlots.offHand = jsonFile.standardSlots.offHand
    standardSlots.rangedWeapon = jsonFile.standardSlots.rangedWeapon
    standardSlots.backpack = jsonFile.standardSlots.backpack
    standardSlots.twoHandedFlag = jsonFile.standardSlots.twoHandedFlag
    standardSlots.rangedWeaponFlag = jsonFile.standardSlots.rangedWeaponFlag
    standardSlots.miscArmor = jsonFile.standardSlots.miscArmor
}

function clearSlots(){
    largeSlots.items = []
    largeSlots.currentSize = 0
    mediumSlots.items = []
    mediumSlots.currentSize = 0
    smallSlots.items = []
    smallSlots.currentSize = 0
    tinySlots.items = []
    tinySlots.currentSize = 0
    derenderSlots()
}

function derenderSlots(){
    //heres the issue
    document.getElementById("large-Slots").innerHTML = '<img src = "container-assets/large_slots.png" class = "container-label">' 
    document.getElementById("medium-Slots").innerHTML = '<img src = "container-assets/medium_slots.png" class = "container-label">' 
    document.getElementById("small-Slots").innerHTML = '<img src = "container-assets/small_slots.png" class = "container-label">' 
    document.getElementById("tiny-Slots").innerHTML = '<img src = "container-assets/tiny_slots.png" class = "container-label">' 
}

export function uploadImage(event, slotID){
    return new Promise((resolve, reject) => {
    const file = event.target.files[0]
    if (!file){
        console.log("file not loaded properly lol")
        reject("No file selected")
        return
    }    

    //creates an instance of a reader using the FileReader API
    const reader = new FileReader() 

    //when the reader loads everything, the loadAll function starts workin.
    reader.onload = function(event) {
        const base64String = event.target.result

        if (standardSlots[slotID]) {
            standardSlots[slotID].image = base64String //sets the image to the base64 string
            resolve(base64String)
        }
        else {
            console.error("Invalid slot ID:", slotID)
            reject("Invalid Slot ID")
            return
        }
    }

    reader.readAsDataURL(file) //reads the file as a data URL
    })
}

//function to save json file
function saveAsJson(){
    //get the data to save
    let largeItems = largeSlots.items
    let mediumItems = mediumSlots.items
    let smallItems = smallSlots.items
    let tinyItems = tinySlots.items
    
    const saveData = {
        player: {name: playerName, strengthModifier},
        standardSlots, 
        items: {
        largeSlots: largeItems,
        mediumSlots: mediumItems,
        smallSlots: smallItems,
        tinySlots: tinyItems}
    }
    
    //turns it into a JSON formatted string
    const jsonData = JSON.stringify(saveData, null, 5)

    const blob = new Blob([jsonData], {
        type : "application/json"
    })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'saveData.json'
    link.click()
}

export function saveToStorage(){
    //get the data to save
    let largeItems = largeSlots.items
    let mediumItems = mediumSlots.items
    let smallItems = smallSlots.items
    let tinyItems = tinySlots.items

    //saves all the json stuff
    const saveData = {
        player: {name: playerName, strengthModifier},
        standardSlots, 
        items: {
        largeSlots: largeItems,
        mediumSlots: mediumItems,
        smallSlots: smallItems,
        tinySlots: tinyItems}
    }

    //saves it into the local storage
    localStorage.setItem("saveData",JSON.stringify(saveData))
}

//loading from storage
function loadFromStorage(){
    const loadData = JSON.parse(localStorage.getItem("saveData"))
    loadAll(loadData)
}

//for save items
function getContainerID(classification){
    //function to map classification to containerID name here
    const containerMap = {
        "small": "small-Slots",
        "medium": "medium-Slots",
        "large": "large-Slots",
        "tiny": "tiny-Slots",
    }
    return containerMap[classification] || null    
}

//unhides all removavle items
function toggleRemoveItems(){ //gets all elements that are remove-able
    let hiddenElements = document.querySelectorAll(".remove-element")
    console.log("found hidden elements:", hiddenElements)
    hiddenElements.forEach(element => {
        element.classList.toggle("hidden")
    })
}

//initialize these slots in an array
let slotArray = document.querySelectorAll(".item-container")
let arrayPointer = 0


document.getElementById("addItem").addEventListener("click", addItem)
document.getElementById("removeItemBtn").addEventListener("click", toggleRemoveItems)

//listen for the save item command
document.getElementById("saveItem").addEventListener("click", function(){
    console.log("Save Item Pressed")
    let newItem = new Item(itemName.value, itemClassification.value, itemDescription.value)
    try {
        classify(newItem)
    } catch(error) {
        console.error("Inventory is Full")
        return
    }
    let slot = getSlotClassification(newItem.classification)
    let containerID = getContainerID(newItem.classification)
    if (slot) {
        slot.renderLastItem(containerID)
    }
    else {
        console.error("Invalid Classification", newItem.classification)
    }

    saveToStorage()
})

//event listeners for the page
document.getElementById("cycleLeft").addEventListener("click", function(){
    console.log(arrayPointer)
    if (arrayPointer > 0){
        slotArray[arrayPointer].classList.toggle("hidden")
        arrayPointer--
        slotArray[arrayPointer].classList.toggle("hidden")
    }
    else {
        slotArray[arrayPointer].classList.toggle("hidden")
        arrayPointer = 4
        slotArray[arrayPointer].classList.toggle("hidden")
    }
    console.log(arrayPointer)
})

document.getElementById("cycleRight").addEventListener("click", function(){
    console.log(arrayPointer)
    if (arrayPointer < 4){
        slotArray[arrayPointer].classList.toggle("hidden")
        arrayPointer++
        slotArray[arrayPointer].classList.toggle("hidden")
    }
    else {
        slotArray[arrayPointer].classList.toggle("hidden")
        arrayPointer = 0
        slotArray[arrayPointer].classList.toggle("hidden")
    }
    console.log(arrayPointer)
})

document.getElementById("newInventory").addEventListener("click", function(){
    console.log("New inventory pressed")
    document.getElementById("initializeModal").style.display = "block"
    
    window.onclick = function(event) { //closes if you touch outside the modal
        if (event.target == document.getElementById("initializeModal")) {
        document.getElementById("initializeModal").style.display = "none"
        }
    }

})

document.getElementById("jsonInput").addEventListener("change", function(event){
    loadJson(event)
    document.getElementById("initializeModal").style.display = "none"
})

document.getElementById("newInventorySubmit").addEventListener("click", function(event){
    event.preventDefault()
    console.log(playerName)
    console.log(strengthModifier)

    playerName = document.getElementById("characterName").value
    strengthModifier = document.getElementById("strengthModifier").value

    console.log("logging char name")
    console.log(document.getElementById("characterName").value)

    if (playerName != "" && strengthModifier != "") {
        console.log("clearing slots")
        console.log(playerName)
        console.log(strengthModifier)
    
        clearSlots()
    }

    console.log(playerName)
    console.log(strengthModifier)

    document.getElementById("playerName").innerText = playerName
    if (strengthModifier < 0){
        document.getElementById("strengthModifierDisplay").innerText = ("-" + strengthModifier)
    }
    else {
        document.getElementById("strengthModifierDisplay").innerText = ("+" + strengthModifier)
    }


    document.getElementById("initializeModal").style.display = "none"
    calculateSlots()
    console.log(smallSlots.maxSize, mediumSlots.maxSize, largeSlots.maxSize)
})

document.getElementById("saveJson").addEventListener("click", function(){
    saveAsJson()
})

document.getElementById("saveStorage").addEventListener("click", function(){
    saveToStorage()
})

document.addEventListener("DOMContentLoaded", function() {
    loadFromStorage()

    initializeCounters()
})

//  to do: fix ts
export function updateCounter(counterID){
    let counter = document.getElementById(counterID)
    if (counterID == "largeSlotCounter"){
        counter.innerText = largeSlots.maxSize - largeSlots.currentSize
        //if inner text is 0, shade it? or make it red?
    }
    else if (counterID == "mediumSlotCounter"){
        counter.innerText = mediumSlots.maxSize - mediumSlots.currentSize
    }
    else if (counterID == "smallSlotCounter"){
        counter.innerText = smallSlots.maxSize - smallSlots.currentSize
    }
}

function initializeCounters(){
    let largeCounter = document.getElementById("largeSlotCounter")
    let mediumCounter = document.getElementById("mediumSlotCounter")
    let smallCounter = document.getElementById("smallSlotCounter")

    largeCounter.innerText = largeSlots.maxSize - largeSlots.currentSize
    mediumCounter.innerText = mediumSlots.maxSize - mediumSlots.currentSize
    smallCounter.innerText = smallSlots.maxSize - smallSlots.currentSize
}

document.getElementById("settingsButton").addEventListener("click", function(){
    document.getElementById("settingsMenu").classList.toggle("hidden")
})

document.getElementById("closeSettings").addEventListener("click", function(){
    document.getElementById("settingsMenu").classList.toggle("hidden")
})

function updateStrengthModifier(){
    let newStrength = parseInt(document.getElementById("strengthModifierDisplay").value)
    console.log(newStrength)
}

document.getElementById("strengthModifierDisplay").addEventListener("blur", () => {
    console.log("Strength Modifier changed")
    strengthModifier = parseInt(document.getElementById("strengthModifierDisplay").innerText)

    calculateSlots()
    updateCounter("largeSlotCounter")
    updateCounter("mediumSlotCounter")
    updateCounter("smallSlotCounter")
    saveToStorage()
})

//listeners for opening and closing from localstorage

//minimum viable product:

//FUNCTIONS NEEDED:
//OPTIMIZE JSON
//SAVE JSON
//SAVE TO LOCAL STORAGE
//CSS