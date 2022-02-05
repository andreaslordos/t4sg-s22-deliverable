import React, { useState } from "react";
import StyledModal from "./StyledModal";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useMutation, useQuery } from "urql";
import {
  ManagementCategory,
  ManagementContainerQuery,
} from "../CaseManagementContainer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "25ch",
    },
  })
);

type DeleteCaseModalProps = {
  open: boolean;
  onClose: () => void;
};

const DeleteCaseMutation = `
mutation DeleteCaseMutation($name: String = "",$category_id: Int = category_id) {
    delete_cases(where: {name: {_eq: $name},category_id: {_eq: $category_id}}) {
      returning {
        id
      }
    }
  }  
`;

const DeleteCaseModal: React.FC<DeleteCaseModalProps> = (props) => {
  const classes = useStyles();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [result, executeMutation] = useMutation(DeleteCaseMutation);
  const [category, setCategory] = useState<number | null>(null);
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });

  return (
    <StyledModal open={props.open} onClose={props.onClose}>
      <Typography variant="h4" align="center">
        Delete Case
      </Typography>
      <Box>
        <TextField
          id="standard-full-width"
          label="Name"
          placeholder="Example Case Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box>
        {data ? (
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                fullWidth
                value={category}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setCategory(event.target.value as number);
                }}
              >
                {data.category.map(function(category: ManagementCategory, index: number){
                    return <MenuItem key={index} value={category.id}>
                    {category.name}
                  </MenuItem>;
                  })}
              </Select>
            </FormControl>
          ) : fetching ? (
            "Loading Categories"
          ) : null}
      </Box>
      <Box mt="10px" display="flex" justifyContent="center">
        <Button
          variant="outlined"
          onClick={() => {
            executeMutation({
              name,
              category_id: category,
            });
            props.onClose();
          }}
        >
          Submit
        </Button>
      </Box>
    </StyledModal>
  );
};
export default DeleteCaseModal;