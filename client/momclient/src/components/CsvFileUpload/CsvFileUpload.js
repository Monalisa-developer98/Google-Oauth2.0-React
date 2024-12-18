import React from 'react'
import './CsvFileUpload.css';
import { importFromCsv } from '../../utils/api';
import { toast} from 'react-toastify';
import { Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";

const CsvFileUpload = () => {
  const [Opendialog, setopendialog] = React.useState(false);

  const handleClickOpen = () => {
    setopendialog(true);
  }

  const handleModalClose = () =>{
    setopendialog(false);
  }

const handleConfirmUpload = () => {
  document.getElementById('file').click();
  setopendialog(false);
}

const handleFileUpload = async(event) => {
    const file = event.target.files[0];
    if (file){
      try {
        const response = await importFromCsv(file);
        console.log('Response is------', response)

        const { message, data} = response;

        // success message for inserted rows
        if (data.inserted && data.inserted.length > 0){
          toast.success(`${message}: ${data.inserted.length} records imported successfully.`);
        }
        // error message with skipped file link
        if (data.skipped && data.skipped.length > 0) {
          toast.error(
            <div>
              {`Skipped ${data.skipped.length} rows due to errors.`}
              {data.skippedFilePath && (
                <div>
                  <a
                    href={`http://localhost:9090/uploads/${data.skippedFilePath.split('\\').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#fff', textDecoration: 'underline' }}
                  >
                    Download Skipped Rows
                  </a>
                </div>
              )}
            </div>
          );
          console.log('skipped filepath-----', data.skippedFilePath)
        } else if (data.inserted.length === 0) {
          toast.warn('No new records were inserted. All rows were skipped.');
      }
      } catch(error){
        toast.error(error.message)
      }
    } else {
      toast.error('No file selected'); 
    }
}

return (
  <div className='import-employee'>
    <Button variant="outlined" 
              color="primary" onClick={handleClickOpen}>
        Import Employee
    </Button>

    <Dialog open={Opendialog} onClose={handleModalClose}>
        <DialogTitle>
           Confirm Upload
        </DialogTitle>
        <DialogContent>
        Are you sure you want to upload a CSV file?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
           Close
          </Button>
          <Button onClick={handleConfirmUpload } color="primary" autoFocus>
           Yes
          </Button>
        </DialogActions>
      </Dialog>

      <input type="file" id="file" name="file" accept=".csv" style={{display: "none"}} onChange={handleFileUpload}></input>
  </div>
  )
}

export default CsvFileUpload