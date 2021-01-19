import React, { useState, useRef } from "react";
import {
  Container,
  Button,
  Checkbox,
  Form,
  Header,
  Card,
} from "semantic-ui-react";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import TagsInput from "react-tagsinput";

const OutputCard = ({ text, service }) => {
  const textArea = useRef(null);
  const [displayText, setDisplayText] = useState(text);
  const [edited, setEdited] = useState(false);
  const [copied,setCopied] = useState(false);
  return (
    <Card>
      <Card.Content header={service} />
      <Card.Content>
        <textarea
          ref={textArea}
          value={displayText}
          onChange={(ev) => {
            setDisplayText(ev.target.value);
            setEdited(true);
          }}
        />
      </Card.Content>
      <Card.Content extra>
        <button
          onClick={() => {
            textArea.current.select();
            document.execCommand("copy");
            setCopied(true);
            setTimeout(()=>setCopied(false), 1000)
          }}
        >
          {copied ? "Coppied!" : "Copy"}
        </button>
        {edited && (
          <button
            onClick={() => {
              setDisplayText(text);
              setEdited(false);
            }}
          >
            Revert Changes
          </button>
        )}
      </Card.Content>
    </Card>
  );
};

export default function Home() {
  const [cities, setCities] = useState(["Seattle", "Tacoma"]);
  const [services, setServices] = useState(["wash floors", "clean cars"]);

  const [output, setOutput] = useState({});
  const [template, setTemplate] = useState(
    "We do the best {{service}} in {{city}}"
  );
  function GenerateOutput() {
    const inputCities = cities.sort();
    const inputServices = services.sort();
    const outputs = inputCities.reduce((cityCollection, city) => {
      cityCollection[city] = inputServices.reduce(
        (serviceCollection, service) => {
          let temp = template.replaceAll("{{city}}", city);
          temp = temp.replaceAll("{{service}}", service);
          serviceCollection[service] = temp;
          return serviceCollection;
        },
        {}
      );
      return cityCollection;
    }, {});
    setOutput(outputs);
  }
  return (
    <div>
      <Header
        as="h1"
        content="City Service Content Gerator"
        textAlign="center"
      />
      <Header
        as="h2"
        content="A PNWDesign Workflow Enhancement Tool™"
        textAlign="center"
      />
      <Container>
        <Form>
          <Form.Field>
            <label>Cities</label>
            <TagsInput
              value={cities}
              onChange={(val) => setCities(val)}
              inputProps={{ placeholder: "Add a City" }}
            />
          </Form.Field>
          <Form.Field>
            <label>Services</label>
            <TagsInput
              value={services}
              onChange={(val) => setServices(val)}
              inputProps={{ placeholder: "Add a Service" }}
            />
          </Form.Field>
          <Form.Field>
            <label>Template</label>
            <input
              value={template}
              onChange={({ target: { value } }) => setTemplate(value)}
              placeholder="Insert Template here, templates will replace {{city}}"
            />
          </Form.Field>

          <Button type="submit" onClick={GenerateOutput}>
            Submit
          </Button>
        </Form>
      </Container>
      <Container>
        {Object.keys(output).map((city) => {
          return (
            <Container>
              <Header as="h1" content={city} textAlign="center" />
              {Object.keys(output[city]).map((service) => {
                return (
                  <OutputCard service={service} text={output[city][service]} />
                );
              })}
            </Container>
          );
        })}
      </Container>
    </div>
  );
}
