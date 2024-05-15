
import React from 'react';
import {fireEvent, getByPlaceholderText, getByText, render, screen, within} from '@testing-library/react';
import App from './App';
//import CRUD from "./components/CRUD";
import {Dog} from "./model/Dog";
import {DogService} from "./services/DogService";

jest.mock('./services/DogService');




/*
const dogs=[new Dog(1, 'Buddy', 25.5, 3),
  new Dog(2, 'Bu', 10, 10),
  new Dog(3, 'Albu', 13.2, 6),
  new Dog(4, 'Max', 25, 2),
  new Dog(5, 'Bella', 26.1, 1),
  new Dog(6, 'Mark', 10, 11),
  new Dog(7, 'Rexy', 3, 14) ];

test('testing add', () => {
  render(<CRUD dogs={dogs}/>);


  const addButton = screen.getByText('Add Dog');


  expect(addButton).toBeInTheDocument();


  fireEvent.click(addButton);

  const nameInput = screen.getByPlaceholderText('Name');
  fireEvent.change(nameInput, { target: { value: 'Buddy' } });

  const weightInput = screen.getByPlaceholderText('Weight');
  fireEvent.change(weightInput, {target: {value: '288'}});

  const ageInput = screen.getByPlaceholderText('Age');
  fireEvent.change(ageInput, {target: {value: '555'}});


  const addButtonModal = screen.getByText('Add Dog Now');
  fireEvent.click(addButtonModal);

  expect(screen.getByText('Buddy')).toBeInTheDocument();


});

test('testing update', () => {
  render(<CRUD dogs={dogs}/>);


  const updateButtonTestId = screen.getByTestId('update-button-1');
  expect(updateButtonTestId).toBeInTheDocument();
  fireEvent.click(updateButtonTestId);

  const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: 'Max' } });

  const weightInput = screen.getByPlaceholderText('Weight') as HTMLInputElement;
  fireEvent.change(weightInput, {target: {value: '288'}});

  const ageInput = screen.getByPlaceholderText('Age') as HTMLInputElement;
  fireEvent.change(ageInput, {target: {value: '555'}});

  // Click the 'Update' button in the modal
  const updateButtonModal = screen.getByText('Update Dog') as HTMLButtonElement;
  fireEvent.click(updateButtonModal);

  expect(screen.getByText('Max')).toBeInTheDocument();
});



test('testing delete', () => {
  render(<CRUD dogs={dogs}/>);


  const deleteButtonTestId = screen.getByTestId('delete-button-1');
  expect(deleteButtonTestId).toBeInTheDocument();
  fireEvent.click(deleteButtonTestId);


  expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
});




test('testing search', () => {
  render(<CRUD dogs={dogs}/>);


  const addButton = screen.getByText('Add Dog');
  expect(addButton).toBeInTheDocument();
  fireEvent.click(addButton);

  const nameInput = screen.getByPlaceholderText('Name');
  fireEvent.change(nameInput, { target: { value: 'Buddy' } });
  const weightInput = screen.getByPlaceholderText('Weight');
  fireEvent.change(weightInput, {target: {value: '288'}});
  const ageInput = screen.getByPlaceholderText('Age');
  fireEvent.change(ageInput, {target: {value: '555'}});

  const addButtonModal = screen.getByText('Add Dog Now');
  fireEvent.click(addButtonModal);


  const addButton2 = screen.getByText('Add Dog'); // Assuming you have a button with text "Add Dog"
  expect(addButton2).toBeInTheDocument();
  fireEvent.click(addButton2);

  const nameInput2 = screen.getByPlaceholderText('Name');
  fireEvent.change(nameInput2, { target: { value: 'Bu' } });
  const weightInput2 = screen.getByPlaceholderText('Weight');
  fireEvent.change(weightInput2, {target: {value: '288'}});
  const ageInput2 = screen.getByPlaceholderText('Age');
  fireEvent.change(ageInput2, {target: {value: '555'}});

  const addButtonModal2 = screen.getByText('Add Dog Now');
  fireEvent.click(addButtonModal2);

  const searchBar = screen.getByPlaceholderText('Search dog by name...');

  expect(searchBar).toBeInTheDocument();
  fireEvent.change(searchBar, { target: { value: 'Bu' } });


  expect(screen.getByText('Buddy')).toBeInTheDocument();
  expect(screen.getByText('Bu')).toBeInTheDocument();




});



test('testing pagination', () => {
  render(<CRUD dogs={dogs}/>);

  expect(screen.getByText('Buddy')).toBeInTheDocument();
  expect(screen.getByText('Bu')).toBeInTheDocument();
  expect(screen.getByText('Albu')).toBeInTheDocument();

  expect(screen.queryByText('Max')).not.toBeInTheDocument();

  const button3 = screen.getByText('3');
  expect(button3).toBeInTheDocument();
  fireEvent.click(button3);

  expect(screen.getByText('Rexy')).toBeInTheDocument();


});

/!*
test('testing  BarChart', () => {
  render(<CRUD />);

  expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

  render(<App />);


  expect(screen.getByTestId('bar-chart')).toBeInTheDocument();



  expect(screen.getByText('Number of dogs under 5 years: 3')).toBeInTheDocument();
  expect(screen.getByText('Number of dogs between 5 and 10 years: 2')).toBeInTheDocument();
  expect(screen.getByText('Number of dogs over 10 years: 2')).toBeInTheDocument();

  const addButton = screen.getByText('Add Dog');


  expect(addButton).toBeInTheDocument();


  fireEvent.click(addButton);

  const nameInput = screen.getByPlaceholderText('Name');
  fireEvent.change(nameInput, { target: { value: 'Bubu' } });

  const weightInput = screen.getByPlaceholderText('Weight');
  fireEvent.change(weightInput, {target: {value: '288'}});

  const ageInput = screen.getByPlaceholderText('Age');
  fireEvent.change(ageInput, {target: {value: '15'}});


  const addButtonModal = screen.getByText('Add Dog Now');
  fireEvent.click(addButtonModal);

  expect(screen.getByText('Number of dogs under 5 years: 3')).toBeInTheDocument();
  expect(screen.getByText('Number of dogs between 5 and 10 years: 2')).toBeInTheDocument();
  expect(screen.getByText('Number of dogs over 10 years: 3')).toBeInTheDocument();



});
*!/


test('Pie Chart displays correct number of dogs in each age group', () => {
  render(<CRUD dogs={dogs}/>);



  expect(screen.getByTestId('pie-chart')).toBeInTheDocument();



  expect(screen.getByText('Number of dogs under 5 years: 3')).toBeInTheDocument();
  expect(screen.getByText('Number of dogs between 5 and 10 years: 2')).toBeInTheDocument();
  expect(screen.getByText('Number of dogs over 10 years: 2')).toBeInTheDocument();

  const addButton = screen.getByText('Add Dog');


  expect(addButton).toBeInTheDocument();


  fireEvent.click(addButton);

  const nameInput = screen.getByPlaceholderText('Name');
  fireEvent.change(nameInput, { target: { value: 'Bubu' } });

  const weightInput = screen.getByPlaceholderText('Weight');
  fireEvent.change(weightInput, {target: {value: '288'}});

  const ageInput = screen.getByPlaceholderText('Age');
  fireEvent.change(ageInput, {target: {value: '15'}});


  const addButtonModal = screen.getByText('Add Dog Now');
  fireEvent.click(addButtonModal);

  expect(screen.getByText('Number of dogs under 5 years: 3')).toBeInTheDocument();
  expect(screen.getByText('Number of dogs between 5 and 10 years: 2')).toBeInTheDocument();
  expect(screen.getByText('Number of dogs over 10 years: 3')).toBeInTheDocument();




});




/!*test('testing update', () => {
  render(<App />);


  // Click the "Update" button for the single list item
  const updateButton = screen.getByText('Update');
  expect(updateButton).toBeInTheDocument();
  fireEvent.click(updateButton);

  const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: 'Max' } });

  const weightInput = screen.getByPlaceholderText('Weight') as HTMLInputElement;
  fireEvent.change(weightInput, {target: {value: '288'}});

  const ageInput = screen.getByPlaceholderText('Age') as HTMLInputElement;
  fireEvent.change(ageInput, {target: {value: '555'}});

  // Click the 'Update' button in the modal
  const updateButtonModal = screen.getByText('Update Dog') as HTMLButtonElement;
  fireEvent.click(updateButtonModal);

  expect(screen.getByText('Max')).toBeInTheDocument();


});*!/

/!*test('testing delete', () => {
  render(<App />);

  const updateButton = screen.getByText('Update');
  expect(updateButton).toBeInTheDocument();


  const deleteButton = screen.getByText('X');
  expect(deleteButton).toBeInTheDocument();
  fireEvent.click(deleteButton);



  expect(screen.queryByText('Update')).not.toBeInTheDocument();

});*!/

/!*test('testing add', () => {
  render(<App />);

  // Click the "Add Dog" button
  const addButton = screen.getByText('Add Dog');
  expect(addButton).toBeInTheDocument();
  fireEvent.click(addButton);

  // Fill in the details in the add dog modal
  const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: 'New Dog' } });

  const weightInput = screen.getByPlaceholderText('Weight') as HTMLInputElement;
  fireEvent.change(weightInput, {target: {value: '20'}});

  const ageInput = screen.getByPlaceholderText('Age') as HTMLInputElement;
  fireEvent.change(ageInput, {target: {value: '2'}});

  // Click the 'Add Dog' button in the modal
  const addDogButton = screen.getByText('Add Dog') as HTMLButtonElement;
  fireEvent.click(addDogButton);

  // Get all dogs by id
  const dogs = screen.getAllByTestId(/list-item-\d+/);

  // Verify the last position
  const lastDogPosition = dogs.length - 1;
  const lastDogName = dogs[lastDogPosition].textContent;
  expect(lastDogName).toContain('New Dog'); // Assuming 'New Dog' is the name of the added dog
});*!/*/
