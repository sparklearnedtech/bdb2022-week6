import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SearchBar({
  address,
  handleInputSearch,
  handleOnSearchClicked,
  handleOnKeyDown,
  placeholder,
  buttonText,
}) {
  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby="basic-addon2"
        type="text"
        value={address}
        onChange={handleInputSearch}
        onKeyDown={handleOnKeyDown}
      />
      <Button
        variant="outline-secondary"
        id="button-addon2"
        onClick={handleOnSearchClicked}
      >
        {buttonText}
      </Button>
    </InputGroup>
  );
}

export default SearchBar;
