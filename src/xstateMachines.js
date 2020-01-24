import { Machine, sendParent, interpret } from "xstate";

const machinesConfig = {
  m1: {
    id: "external1",
    initial: "running",
    states: {
      running: {
        after: {
          100: {
            actions: sendParent("external.done")
          }
        }
      }
    }
  },
  m2: {
    id: "external2",
    initial: "running",
    states: {
      running: {
        after: {
          100: {
            actions: sendParent("external.failed")
          }
        }
      }
    }
  }
};

function machineFactoryFunction(id = "m1") {
  return machinesConfig[id];
}

const parentMachine = Machine({
  id: "parent",
  initial: "initializing",
  on: {
    "machine.init": ".externalContent",
    "async.machine.init": ".externalContent",
    "external.done": "externalUnloaded",
    "external.failed": "externalFailed"
  },
  context: {
    localOne: null,
    runtimeMachine: null
  },
  states: {
    initializing: {},
    externalContent: {},
    externalUnloaded: {},
    externalFailed: {},
    initAsyncMachine: {}
  }
});

const parentService = interpret(parentMachine, { logger: console.log })
  .onTransition(state => console.log(state))
  .start();
parentService.onEvent(event => {
  console.log("event", event);
  if (event && event.type === "async.machine.init") {
    const internalSpawn = () =>
      parentService.spawnMachine(Machine(machineFactoryFunction()));
    setTimeout(internalSpawn, 3000);
  } else if (event && event.type === "machine.init")
    parentService.spawnMachine(Machine(machineFactoryFunction()));
});

export { parentService as default, parentMachine };
