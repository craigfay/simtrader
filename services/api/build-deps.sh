HERE="$(pwd)"

cd $HERE/node_modules/@lepton/db
npm install
npm run build

cd $HERE/node_modules/@lepton/schema
npm install
npm run build
