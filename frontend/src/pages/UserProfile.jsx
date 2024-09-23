
import { Container, Flex } from '@chakra-ui/react';
import Content from '../components/UpdateUser';
import Sidebar from '../components/Profile';

export default function Main() {



  return (

      <Container maxW="container.xl" p={4}>
        <Flex direction={{ base: 'column', md: 'row' }}>
          <Sidebar flex={{ base: '1', md: '1 30%' }} />
          <Content flex={{ base: '1', md: '3 70%' }} />
        </Flex>

      </Container>

  );
}
