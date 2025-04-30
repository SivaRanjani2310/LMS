import React from 'react'
import "./ClientTable.css"
const Table = () => {
  return (
      <div className='client-table'>
          {/* content start */}
          <table className='table'>
              <thead className='table-bottom'>
                  <td>No</td>
                  <td>Course Name</td>
                  <td>Status</td>
                  <td>Mark</td>
                  <td>Percentage</td>
              </thead>
              <tbody>
                  <tr>
                      <td>1</td>
                      <td>Course 1</td>
                      <td><button className='progress1'>progress</button></td>
                      <td>11</td>
                      <td><button className='percentage'>Not started</button></td>
                  </tr>
              </tbody>
          </table>
          {/* content end */}
          
    </div>
  )
}

export default Table