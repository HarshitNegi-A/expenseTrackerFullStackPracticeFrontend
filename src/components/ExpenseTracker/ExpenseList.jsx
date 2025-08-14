import React from 'react'

const ExpenseList = ({lists}) => {
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
    </>
  )
}

export default ExpenseList