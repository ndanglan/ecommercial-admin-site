import React from 'react';

const Input = React.forwardRef((props, ref) => {
  const { inputRef, id, label, labelSize, inputSize, frmField, err, errMessage, ...others } = props;

  const inputClass = `form-control ${err ? "is-invalid" : ""}`;
  return (
    <div className="row mb-3">
      <label
        htmlFor={ id }
        className={ `col-sm-${labelSize} col-form-label text-capitalize required` }
      >
        { label }
      </label>
      <div className="col-sm">
        { others['row'] > 1
          ?
          <textarea
            className={ `form-control ${inputClass}` }
            id={ id }
            ref={ inputRef }

            { ...frmField }
            { ...others }
          ></textarea>
          : <input
            className={ `form-control ${inputClass}` }
            id={ id }
            ref={ inputRef }
            { ...frmField }
            { ...others }
          /> }
        { err ? <div className='invalid-feedback'>{ errMessage }</div> : "" }
      </div>
    </div>

  )
})

export default Input;