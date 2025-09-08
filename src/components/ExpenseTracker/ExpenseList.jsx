import React, { useContext } from 'react'
import { DownloadExpense } from './DownloadExpense'
import UserContext from '../context/user-context'

const ExpenseList = ({lists}) => {
     const {user}=useContext(UserContext)
  return (
    <>
    <table>
        <thead>
            <tr>
                <th>Amount Spend</th>
                <th>Description</th>
                <th>Category</th>
            </tr>
        </thead>
        <tbody>
            {lists?.map((list)=>(
                <tr key={list.id}>
                    <td>{list.amount}</td>
                    <td>{list.description}</td>
                    <td>{list.category}</td>
                </tr>
            ))}
        </tbody>
    </table>
    {user?.isPremium &&  <DownloadExpense lists={lists}/>}
    </>
  )
}

export default ExpenseList