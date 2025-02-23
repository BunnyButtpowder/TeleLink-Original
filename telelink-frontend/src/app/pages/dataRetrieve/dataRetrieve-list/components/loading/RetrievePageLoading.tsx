import { DataRetrieveHeader } from "../header/DataRetrieveHeader"

const RetrievePageLoading = () => {
  const styles = {
    borderRadius: '0.475rem',
    boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
    backgroundColor: '#fff',
    color: '#7e8299',
    fontWeight: '500',
    margin: '0',
    width: 'auto',
    padding: '1rem 2rem',
    top: 'calc(50% - 2rem)',
    left: 'calc(50% - 4rem)',
  }

  return (
    <div className='card card-xl-stretch mb-xl-8'>
        <div className='card-body p-0'>
          <div className={`px-9 pt-7 card-rounded h-85px w-100 bg-danger`} style={{ backgroundImage: `url('media/patterns/vector-1.png')` }}>
            <div className='d-flex flex-stack'>
              <h3 className='m-0 text-white fw-bold fs-3'>Thu hồi dữ liệu</h3>
              <div className='ms-1'>
                <DataRetrieveHeader />
              </div>
            </div>
          </div>
          <div
            className=' card-rounded mx-9 mb-9 py-9 position-relative z-index-1 bg-body'
          >
            <div style={{...styles, position: 'absolute', textAlign: 'center', marginTop: '20px'}}>Đang tải...</div>
          </div>
        </div>
      </div>
  )
}

export {RetrievePageLoading}
