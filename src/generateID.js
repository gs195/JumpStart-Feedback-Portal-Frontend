let record = 7;

function generateID() {
  let lastNumber = record;
  record = lastNumber + 1;
  return record;
}

export default generateID;
