import {
  Header,
  Title,
  Button,
  Icon,
  Right,
  Body,
  Left
} from "native-base";

const HeaderComponent = (props) => {
    return (
      <Header>
        <Left>
          <Button transparent>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={{ flex: 3 }}>
          <Title>Symptoms</Title>
        </Body>
        <Right />
      </Header>
    );
  };

  export default HeaderComponent;
