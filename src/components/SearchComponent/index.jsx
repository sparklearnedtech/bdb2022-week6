import { FormControl, InputGroup } from 'react-bootstrap';

function SearchComponent({
  address,
  inputHandler,
}) {
  return (
    <InputGroup>
      <FormControl
        type="search"
        placeholder="Search by Address..."
        aria-label="Search"
        value={address}
        onChange={inputHandler}
      />         
    </InputGroup>
  );
}

export default SearchComponent;
