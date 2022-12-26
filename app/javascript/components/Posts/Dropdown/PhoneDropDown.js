import React,{useState,useEffect} from 'react'
import './Dropdown.css'
import {BiChevronDown} from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { setCategory } from '../../../redux/actions'
import {BsFilter, BsFilterRight} from 'react-icons/bs'
const PhoneDropDown = ({allCategories}) => {
    
    const [tempCategory,setTempCategory] = useState('All')
    const dispatch=useDispatch()
    const [active,setActive] = useState(false)
    const phoneSelectCategory = (index,name)=>{
        setActive(false)
        setTempCategory(name)
        dispatch(setCategory(name))
    }
    return (
        <div className='dropdown'>
        
        <div className='dropdown-button' onClick={()=>setActive(!active)}>
            <BsFilter/>
        </div>
       {active && 
       (
        <div className='dropdown-content' style={{zIndex:20}}>
            <div className={tempCategory==='All' ? 'dropdown-item-active':'dropdown-item'} onClick={()=>phoneSelectCategory(-1,'All')} >
                   All
            </div>
            {allCategories.map((item,index)=>

                <div className={tempCategory===item.attributes.name ? 'dropdown-item-active':'dropdown-item'} onClick={()=>phoneSelectCategory(item.id,item.attributes.name)} >
                    {item.attributes.name}
                </div>
            )}
          
           
        </div>
       )} 
    </div>
    )
}

export default PhoneDropDown