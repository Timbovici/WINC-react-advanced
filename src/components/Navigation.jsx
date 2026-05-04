import { Link } from 'react-router-dom';
import { Flex, Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { AddEventModal } from './AddEventModal';

export const Navigation = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <Flex as="nav" bg="teal.500" color="white" padding={4} gap={4} alignItems="center">
        <Box>
          <Link to="/">Home</Link>
        </Box>
        <Box>
          <Link to="/about">About Us</Link>
        </Box>
        <Box ml="auto"> 
            <Button onClick={() => setIsAddModalOpen(true)} colorScheme="whiteAlpha" variant="outline">
              Add Event
            </Button>
        </Box>
      </Flex>

      <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
};