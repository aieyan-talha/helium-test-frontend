import React from "react";
import Form from "react-bootstrap/Form";
import { useController } from "react-hook-form";

export const TextField = ({
  name,
  type,
  label,
  placeholder,
  className,
  control,
  as,
}) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <Form.Group className={`textfield-container padding-bottom ${className}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        as={as}
        isInvalid={!!error}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error.message}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
