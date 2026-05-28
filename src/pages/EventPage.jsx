import { Box, Heading, Text, Image, Button, Flex, Skeleton, SkeletonText } from '@chakra-ui/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { EventContext } from '../components/EventContext';
import { EditEventModal } from '../components/EditEventModal';
import { toaster } from "../components/ui/toaster"; 

export const EventPage = () => {
  const { eventId } = useParams();
  const { events, categories, fetchAllData, loading } = useContext(EventContext);
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const event = events.find((e) => e.id == eventId);

  if (loading || !event) {
    return (
      <Box p={8} maxW="800px" mx="auto" bg="white" color="black" borderRadius="md">
        <Skeleton height="40px" width="200px" mb={4} /> 
        <Skeleton height="300px" w="100%" borderRadius="lg" mb={6} /> 
        <Skeleton height="32px" width="50%" mb={4} /> 
        <SkeletonText mt="4" noOfLines={3} spacing="4" mb={6} /> 
        <Skeleton height="120px" w="100%" borderRadius="md" mb={6} /> 
        <Skeleton height="24px" width="120px" mb={2} /> 
        <Flex gap={2} mb={6}>
          <Skeleton height="32px" width="80px" borderRadius="md" />
          <Skeleton height="32px" width="100px" borderRadius="md" />
        </Flex>
        <Flex gap={4}>
          <Skeleton height="40px" width="120px" borderRadius="md" />
          <Skeleton height="40px" width="120px" borderRadius="md" />
        </Flex>
      </Box>
    );
  }

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString([], {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (window.confirm("Weet je zeker dat je dit evenement wilt verwijderen?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchAllData(); 
          toaster.create({
            title: "Verwijderd!",
            description: "Het evenement is succesvol verwijderd.",
            type: "success",
            duration: 3000,
          });
          navigate('/'); 
        } else {
          toaster.create({ 
            title: "Fout", 
            description: "Er is iets misgegaan.", 
            type: "error", 
            duration: 3000 
          });
        }
      } catch (error) {
        console.error("Fout:", error);
      }
    }
  };

  return (
    <Box p={8} maxW="800px" mx="auto" bg="white" color="black" borderRadius="md">
      <Link to="/">
        <Button mb={4} variant="outline" colorScheme="gray" color="black">
          ← Terug naar overzicht
        </Button>
      </Link>
      
      <Image 
        src={event.image} 
        alt={event.title} 
        w="100%" 
        h="300px" 
        objectFit="cover" 
        borderRadius="lg" 
        mb={6} 
      />
      
      <Heading mb={4}>{event.title}</Heading>
      <Text fontSize="lg" color="gray.700" mb={4}>{event.description}</Text>
      
      <Box bg="gray.100" p={4} borderRadius="md" color="black" mb={6}>
        <Text mb={2}><strong>Locatie:</strong> {event.location}</Text>
        <Text mb={2}><strong>Start:</strong> {formatTime(event.startTime)}</Text>
        <Text><strong>Eind:</strong> {formatTime(event.endTime)}</Text>
      </Box>

      <Box mb={6}>
        <Text fontWeight="bold" mb={2}>Categorieën:</Text>
        <Flex gap={2} wrap="wrap">
          {event.categoryIds.map((categoryId) => {
            const category = categories.find((c) => Number(c.id) === Number(categoryId));
            return category ? (
              <Box 
                key={category.id} 
                bg="teal.100" 
                color="teal.800" 
                px={2} 
                py={1} 
                borderRadius="md" 
                fontSize="sm" 
                fontWeight="bold"
              >
                {category.name}
              </Box>
            ) : null;
          })}
        </Flex>
      </Box>

      <Flex gap={4}>
        <Button bg="red.500" color="white" _hover={{ bg: "red.600" }} onClick={handleDelete}>
          Verwijderen
        </Button>
        <Button bg="blue.500" color="white" _hover={{ bg: "blue.600" }} onClick={() => setIsEditModalOpen(true)}>
          Bewerken
        </Button>
      </Flex>

      <EditEventModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        event={event} 
      />
    </Box>
  );
};