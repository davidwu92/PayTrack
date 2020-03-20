import React, {useState, useEffect} from 'react'
import {Button} from 'react-materialize'
import './ColorPreferences.css'
import UserAPI from '../../utils/UserAPI'

const { getColors, editColors } = UserAPI

const ColorPreferences = () => {
  const [colorState, setColorState] = useState({
    colorArray:[
      // "red",//housing
      // "orange",//insurance
      // "blue",//loan
      // "purple",//taxes
      // "chocolate",//family
      // "black",//recreation
      // "green",//income
      // "grey" //other
    ],
    paletteOn: false,
    selectedCategory:  -1,
  })

  useEffect(()=>{
    let token = JSON.parse(JSON.stringify(localStorage.getItem("token")))
    getColors(token)
      .then(({data})=>{
        setColorState({...colorState, colorArray: data.colorPreferences})
        // console.log(colorState)
      })
      .catch(e=>console.error(e))
  },[])

  //toggles visibility of palette.
  const paletteVisibility = colorState.paletteOn ? {visibility:"visible"} : {visibility:"hidden", height: "0px"}
  //close color palette.
  const closePalette = () => setColorState({...colorState, paletteOn: false, selectedCategory: -1})  
  //upon selecting a category
  const categorySelect = (e) =>setColorState({...colorState, paletteOn: true, selectedCategory: e.target.value})
  //upon choosing a color:
  const colorSelect = (e) =>{
    let newColors = colorState.colorArray
    newColors[colorState.selectedCategory] = e.target.value
    editColors(localStorage.getItem("userId"), {colorPreferences: newColors})
      .then(()=>{})
      .catch(e=>console.error(e))
    setColorState({colorArray: newColors, paletteOn: false, selectedCategory: -1})
    window.location.reload()
  }

  return(
    <>
      <div className="row">
        <div className="center">
          <Button onClick={categorySelect} className={colorState.selectedCategory == 0 ? "categoryButton btn-large waves-effect":"categoryButton btn-flat white-text"} 
            value="0" style={{backgroundColor: colorState.colorArray[0]}}>Housing</Button>
          <Button onClick={categorySelect} className={colorState.selectedCategory == 1 ? "categoryButton btn-large waves-effect":"categoryButton btn-flat white-text"} 
            value="1" style={{backgroundColor: colorState.colorArray[1]}}>Insurance</Button>
          <Button onClick={categorySelect} className={colorState.selectedCategory == 2 ? "categoryButton btn-large waves-effect":"categoryButton btn-flat white-text"} 
            value="2" style={{backgroundColor: colorState.colorArray[2]}}>Loan</Button>
          <Button onClick={categorySelect} className={colorState.selectedCategory == 3 ? "categoryButton btn-large waves-effect":"categoryButton btn-flat white-text"} 
            value="3" style={{backgroundColor: colorState.colorArray[3]}}>Taxes</Button>
          <Button onClick={categorySelect} className={colorState.selectedCategory == 4 ? "categoryButton btn-large waves-effect":"categoryButton btn-flat white-text"} 
            value="4" style={{backgroundColor: colorState.colorArray[4]}}>Family</Button>
          <Button onClick={categorySelect} className={colorState.selectedCategory == 5 ? "categoryButton btn-large waves-effect":"categoryButton btn-flat white-text"} 
            value="5" style={{backgroundColor: colorState.colorArray[5]}}>Recreation</Button>
          <Button onClick={categorySelect} className={colorState.selectedCategory == 6 ? "categoryButton btn-large waves-effect":"categoryButton btn-flat white-text"} 
            value="6" style={{backgroundColor: colorState.colorArray[6]}}>Income</Button>
          <Button onClick={categorySelect} className={colorState.selectedCategory == 7 ? "categoryButton btn-large waves-effect":"categoryButton btn-flat white-text"} 
            value="7" style={{backgroundColor: colorState.colorArray[7]}}>Other</Button>
        </div>
        <div className="center" style={paletteVisibility}>
          <Button style={{marginRight: "3px"}} className="white btn-floating" onClick={closePalette}>
            <i className="material-icons black-text">close</i>
          </Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"red", marginRight: "3px", marginBottom: "3px"}} value="red"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"magenta", marginRight: "3px", marginBottom: "3px"}} value="magenta"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"deeppink", marginRight: "3px", marginBottom: "3px"}} value="deeppink"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"darkorange", marginRight: "3px", marginBottom: "3px"}} value="darkorange"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor: "chocolate", marginRight: "3px", marginBottom: "3px"}} value="chocolate"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"sienna", marginRight: "3px", marginBottom: "3px"}} value="sienna"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"brown", marginRight: "3px", marginBottom: "3px"}} value="brown"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"darkorchid", marginRight: "3px", marginBottom: "3px"}} value="darkorchid"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"purple", marginRight: "3px", marginBottom: "3px"}} value="purple"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"indigo", marginRight: "3px", marginBottom: "3px"}} value="indigo"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"blue", marginRight: "3px", marginBottom: "3px"}} value="blue"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"dodgerblue", marginRight: "3px", marginBottom: "3px"}} value="dodgerblue"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"teal", marginRight: "3px", marginBottom: "3px"}} value="teal"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"darkgreen", marginRight: "3px", marginBottom: "3px"}} value="darkgreen"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"green", marginRight: "3px", marginBottom: "3px"}} value="green"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"grey", marginRight: "3px", marginBottom: "3px"}} value="grey"></Button>
          <Button onClick={colorSelect} className="btn-small btn-floating" style={{backgroundColor:"black", marginRight: "3px", marginBottom: "3px"}} value="black"></Button>
        </div>
      </div>
    </>
  )
}

export default ColorPreferences