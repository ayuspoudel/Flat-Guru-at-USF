import PropTypes from 'prop-types';

const FormInput = ({ label, name, type, value, onChange, size }) => {
  const handleChange = (e) => {
    // Call the passed onChange function with the event
    onChange(e);
  };

  return (
    <div className='form-control'>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize'>{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={type === 'file' ? undefined : value}  // Clear value for file inputs
        className={`input input-bordered ${size}`}
        onChange={handleChange}
        accept={type === 'file' ? 'image/*' : undefined}  // Set accept for file inputs
      />
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.string
};

export default FormInput;