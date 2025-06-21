import { StandardSlots } from "./slots.js"
import { standardSlots } from "./logic.js"





 



export function uploadImageToStandard(event, slotID){
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

        //for if slotID is provided, update the standard slots
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

//upload an image to the item frame 
export function uploadImage(event){
    return new Promise((resolve, reject) => {
        const file = event.target.files[0]
        if (!file){
            console.log("file not loaded properly lol")
            reject("No file selected LOL")
            return
        }

        const reader = new FileReader()
        reader.onload = function(event){
            resolve(event.target.result)
        }
        reader.onerror = function(error){
            reject(error)
        }
        reader.readAsDataURL(file)
    })  
}
