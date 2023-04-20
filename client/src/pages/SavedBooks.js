import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import {GET_ME} from '../utils/queries'
import {REMOVE_BOOK} from '../utils/mutations'
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [deleteBook, { error, da }] = useMutation(REMOVE_BOOK);

  const user = Auth.getProfile()
  const userId = user.data._id

  const { loading, data } = useQuery(GET_ME, {
    variables: { userId: userId},
  });
  
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      const {data} = await deleteBook({
        variables: { bookId, userId},
      });

      if (error) {
        throw new Error('there is an error');
      }

      const updatedUser = data.removeBook;
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (data && data.me) {
      setUserData(data.me);
    }
  }, [data]);

  if (loading) {
    return <h2>LOADING...</h2>;
  } 
 
  
    return (
      <>
        <div fluid className='text-light bg-dark p-5'>
          <Container>
            <h1>Viewing saved books!</h1>
          </Container>
        </div>
        <Container>
          <h2 className='pt-5'>
            {userData.savedBooks
              ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
              : 'You have not saved any books'}
          </h2>
          {userData.savedBooks &&
            <Row>
            {userData.savedBooks.length > 1 && userData.savedBooks.map((book) => {
              return (
                <Col md="4">
                  <Card key={book.bookId} border='dark'>
                    {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <p className='small'>Authors: {book.authors}</p>
                      <Card.Text>{book.description}</Card.Text>
                      <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                        Delete this Book!
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
          }
          
        </Container>
      </>
    );
  
};

export default SavedBooks;