import { Box, Heading, Text, Image, Button, Flex } from '@chakra-ui/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { EventContext } from '../components/EventContext';
import { EditEventModal } from '../components/EditEventModal';

export const EventPage = () => {
  const { eventId } = useParams();
  const { events, categories, fetchAllData } = useContext(EventContext);
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Zoek het specifieke evenement op
  const event = events.find((e) => e.id == eventId);

  // Als het evenement nog niet geladen is
  if (!event) return <Box p={8}><Text>Evenement laden...</Text></Box>;

  // Onze vertrouwde tijd-vertaler
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString([], {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // De verwijder-functie met alert
  const handleDelete = async () => {
    if (window.confirm("Weet je zeker dat je dit evenement wilt verwijderen?")) {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchAllData(); 
          alert("Het evenement is succesvol verwijderd!"); // Simpel en voldoet aan de eis
          navigate('/'); 
        } else {
          alert("Er is iets misgegaan bij het verwijderen op de server.");
        }
      } catch (error) {
        console.error("Fout:", error);
        alert("Kan geen verbinding maken met de server om te verwijderen.");
      }
    }
  };

  return (
    <Box p={8} maxW="800px" mx="auto">
      {/* Terugknop */}
      <Link to="/">
        <Button mb={4} variant="outline">← Terug naar overzicht</Button>
      </Link>
      
      {/* Grote afbeelding */}
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
      
      {/* Info blok met Locatie en Tijden */}
      <Box bg="gray.100" p={4} borderRadius="md" color="black" mb={6}>
        <Text mb={2}><strong>Locatie:</strong> {event.location}</Text>
        <Text mb={2}><strong>Start:</strong> {formatTime(event.startTime)}</Text>
        <Text><strong>Eind:</strong> {formatTime(event.endTime)}</Text>
      </Box>

      {/* Categorie labels */}
      <Box mb={6}>
        <Text fontWeight="bold" mb={2}>Categorieën:</Text>
        <Flex gap={2} wrap="wrap">
          {event.categoryIds.map((categoryId) => {
            const category = categories.find((c) => c.id == categoryId);
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

      {/* Actie knoppen */}
      <Flex gap={4}>
        <Button colorScheme="red" onClick={handleDelete}>
          Verwijderen
        </Button>
        <Button colorScheme="blue" onClick={() => setIsEditModalOpen(true)}>
          Bewerken
        </Button>
      </Flex>

      {/* De pop-up voor bewerken */}
      <EditEventModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        event={event} 
      />
    </Box>
  );
};