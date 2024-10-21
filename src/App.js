import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Download, Pencil, Trash2, Check, X } from "lucide-react";

const TodoApp = () => {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [listName, setListName] = useState("");
  const [savedLists, setSavedLists] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedLists");
    if (saved) setSavedLists(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("savedLists", JSON.stringify(savedLists));
  }, [savedLists]);

  const toggleItemCompleted = (itemId) => {
    const updatedItems = items.map((item) => {
      if (itemId === item.id) item.done = !item.done;
      return item;
    });

    setItems(updatedItems);
  };

  const deleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const addItem = (event) => {
    event.preventDefault();

    const newItem = {
      id: Date.now(),
      text,
      done: false,
    };

    setItems([...items, newItem]);
    setText("");
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItemIds((prevSelectedItemIds) =>
      prevSelectedItemIds.includes(itemId)
        ? prevSelectedItemIds.filter((id) => id !== itemId)
        : [...prevSelectedItemIds, itemId]
    );
  };

  const deleteSelectedItems = () => {
    setItems((prevItems) =>
      prevItems.filter((item) => !selectedItemIds.includes(item.id))
    );
    setSelectedItemIds([]);
  };

  const saveList = () => {
    if (listName.trim() && items.length > 0) {
      setSavedLists([...savedLists, { id: Date.now(), name: listName, items }]);
      setListName("");
      setItems([]);
    }
  };

  const resumeList = (list) => {
    setItems(list.items);
  };

  const editList = (list) => {
    setItems(list.items);
    setSavedLists(savedLists.filter((l) => l.id !== list.id));
  };

  const deleteList = (id) => {
    setSavedLists(savedLists.filter((list) => list.id !== id));
  };

  return (
    <AppContainer>
      <Title>TO DO LIST</Title>
      <InputContainer>
        <StyledInput
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
        />
        <StyledButton onClick={addItem} disabled={!text}>
          {"Add #" + (items.length + 1)}
        </StyledButton>
      </InputContainer>

      <Card>
        <CardHeader>Current List</CardHeader>
        <CardContent>
          {items.map((item) => (
            <TodoItem key={item.id}>
              <TodoContent>
                <input
                  type="checkbox"
                  checked={
                    !!selectedItemIds.find(
                      (selectedItemId) => selectedItemId === item.id
                    )
                  }
                  onChange={() => toggleSelectItem(item.id)}
                />
                <TodoText $done={item.done}>{item.text}</TodoText>
              </TodoContent>
              <IconButtonsContainer>
                <IconButton onClick={() => toggleItemCompleted(item.id)}>
                  {item.done ? (
                    <X className="icon" />
                  ) : (
                    <Check className="icon" />
                  )}
                </IconButton>
                <IconButton onClick={() => deleteItem(item.id)}>
                  <Trash2 className="icon red" />
                </IconButton>
              </IconButtonsContainer>
            </TodoItem>
          ))}
        </CardContent>
        {selectedItemIds.length > 0 && (
          <CardFooter>
            <div>{`${selectedItemIds.length} item${
              selectedItemIds.length > 1 ? "s" : ""
            } selected`}</div>
            <IconButton onClick={() => deleteSelectedItems()}>
              <span className="red">delete selected</span>{" "}
              <Trash2 className="icon red" />
            </IconButton>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>Save Current List</CardHeader>
        <CardContent>
          <InputContainer>
            <StyledInput
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name..."
            />
            <StyledButton
              onClick={saveList}
              disabled={!listName || items.length === 0}
            >
              Save
            </StyledButton>
          </InputContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Saved Lists</CardHeader>
        <CardContent>
          {savedLists.map((list) => (
            <SavedListItem key={list.id}>
              <span>{list.name}</span>
              <IconButtonsContainer>
                <IconButton onClick={() => resumeList(list)}>
                  <Download className="icon" />
                </IconButton>
                <IconButton onClick={() => editList(list)}>
                  <Pencil className="icon" />
                </IconButton>
                <IconButton onClick={() => deleteList(list.id)}>
                  <Trash2 className="icon red" />
                </IconButton>
              </IconButtonsContainer>
            </SavedListItem>
          ))}
        </CardContent>
      </Card>
    </AppContainer>
  );
};

const PRIMARY_COLOR = "#0000AA";
const SECONDARY_COLOR = "#0000FF";

const AppContainer = styled.div`
  font-family: sans-serif;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: ${PRIMARY_COLOR};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${SECONDARY_COLOR};
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 10px 15px;
`;
const CardHeader = styled.h2`
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 1rem;
`;
const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  margin-top: 1rem;
`;

const TodoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const TodoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const TodoText = styled.span`
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
  color: ${({ $done }) => ($done ? "darkgreen" : "")};
`;

const SavedListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  .icon {
    width: 16px;
    heigth: 16px;
  }
  .red {
    color: darkred;
  }
`;

export default TodoApp;
