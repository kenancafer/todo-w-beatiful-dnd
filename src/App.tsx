import { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Button, Container, Modal, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { nanoid } from "nanoid";

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 25px;
`;
const MultipleUsageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;
const DropList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 50px;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 300px;
`;

const EditDeleteContainer = styled.div`
  display: flex;
  gap: 10px;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
// const ModalBackground = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;
// const ModalContainer = styled.div`
//   background-color: white;
//   padding: 20px;
//   border-radius: 10px;
//   display: flex;
//   gap: 10px;
//   align-items: center;
// `;

interface ItemProps {
  id: string;
  content: string;
}
const initialItems = [
  { id: "1", content: "Yatağını düzelt" },
  { id: "2", content: "Çöpleri çıkart" },
  { id: "3", content: "Saçını kestir" },
];
function App() {
  const [item, setItem] = useState<ItemProps[]>(initialItems);
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }
    const updatedItems = Array.from(item);
    const [movedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, movedItem);

    setItem(updatedItems);
  };
  const handleDelete = (id: string) => {
    const updatedItems = item.filter((items) => items.id !== id);
    setItem(updatedItems);
  };
  const addItem = () => {
    if (!input.trim()) return;
    const listId = nanoid();
    const newList = {
      id: listId,
      content: input,
    };
    setItem([...item, newList]);
    setInput("");
  };
  const openEditModal = (id: string, content: string) => {
    setOpen(true);
    setEdit(content);
    setSelectedId(id);
  };
  const saveEditedItem = () => {
    const selectedItem = item.find((items) => items.id === selectedId);
    if (selectedItem) {
      selectedItem.content = edit;
      setItem([...item]);
      setOpen(false);
    }
  };
  const closeEditedModal = () => {
    setOpen(false);
  };
  return (
    <>
      <Container>
        <InputContainer>
          <TextField
            type="text"
            id="outlined-basic"
            label="Görevleri giriniz"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />

          <Button
            sx={{
              marginLeft: 2, // Adds margin around the button
            }}
            color="secondary"
            variant="contained"
            onClick={addItem}
          >
            Ekle
          </Button>
        </InputContainer>
        <ListContainer>
          <List>
            <h2>Yapılacaklar Listesi</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {item.map(({ id, content }: ItemProps, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <DropList
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {content}

                            <EditDeleteContainer>
                              <Button
                                color="secondary"
                                onClick={() => openEditModal(id, content)}
                                variant="contained"
                                size="small"
                              >
                                <EditIcon />
                              </Button>
                              <Button
                                color="secondary"
                                variant="contained"
                                size="small"
                                onClick={() => handleDelete(id)}
                              >
                                <DeleteIcon />
                              </Button>
                            </EditDeleteContainer>
                          </DropList>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </ListContainer>
      </Container>
      {open && (
        <Modal
          open={open}
          onClose={closeEditedModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <MultipleUsageContainer>
              <TextField
                type="text"
                value={edit}
                onChange={(e) => {
                  setEdit(e.target.value);
                }}
              />
              <Button variant="contained" onClick={saveEditedItem}>
                SAVE
              </Button>
            </MultipleUsageContainer>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default App;
