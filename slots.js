import { CoinPouch,emptyItem } from "./item.js"
import { smallSlots, mediumSlots, largeSlots, tinySlots } from "./logic.js"


//helper function to map classifications to inventory slots
export function getSlotClassification(classification){
    const slotMap = {
        "small": smallSlots,
        "medium": mediumSlots,
        "large": largeSlots,
        "tiny": tinySlots,
    }
    return slotMap[classification] || null
}

export class Slots{
    constructor(maxSize) {
        this.maxSize = maxSize
        this.currentSize = 0
        this.items = []
    }

    renderAllItems(containerID){
        this.items.forEach(item => item.renderItem(containerID)) //adds em all
    }
    
    renderLastItem(containerID){
        console.log("Rendering last item appended")
        let lastItem = this.items[this.items.length - 1] //gets the index of the last item in this slot
        lastItem.renderItem(containerID) //renders it
    }

}

export class StandardSlots extends Slots{
    constructor(){
        super(0) //run the max size as 0
        this.armorSlot = emptyItem
        this.mainHand = emptyItem
        this.offHand = emptyItem
        this.rangedWeapon = emptyItem
        this.backpack = emptyItem
        this.rangedWeaponFlag = true //if you are using a ranged weapon or converting it into two small slots
        this.twoHandedFlag = false //if you are using two hands
        this.miscArmor = [] //for miscallaneous enchanted items
    }

    renderStandardSlots(){
        //create the slots
        let itemDiv = document.createElement("div")//create the div that holds the data
        let armorDiv = document.createElement("div")
        let mainHand = document.createElement("div")
        let offHand = document.createElement("div")
        let rangedDiv = document.createElement("div")
        let backpack = document.createElement("div")

        //classlist to turn em into square boxes
        armorDiv.classList.add("equipment-slot")
        mainHand.classList.add("equipment-slot")
        offHand.classList.add("equipment-slot")
        rangedDiv.classList.add("equipment-slot")
        backpack.classList.add("equipment-slot")

        //append ts
        itemDiv.appendChild(armorDiv)
        itemDiv.appendChild(mainHand)
        itemDiv.appendChild(offHand)
        itemDiv.appendChild(rangedDiv)
        itemDiv.appendChild(backpack)
        document.getElementById("standard-Slots").appendChild(itemDiv);
    }
}

export function addItem(){ //fix this and understand the rest
    let modal = document.getElementById("itemAddModal")
    modal.style.display = "block"

    window.onclick = function(event) { //closes if you touch outside the modal
        if (event.target == modal) {
        modal.style.display = "none"
        }
    }
}

export function removeItem(){
    let toRemove = document.querySelectorAll(".remove-checkbox:checked")

    toRemove.forEach(element => {
        let itemDiv = element.closest(".itemDiv")
        let itemID = parseInt(itemDiv.dataset.id)
        let slot = getSlotClassification(itemDiv.dataset.classification)
        let item = slot.items.find(item => item.id === itemID)


        slot.items.splice(itemID, 1)
        slot.currentSize--
        itemDiv.remove()
    })
}