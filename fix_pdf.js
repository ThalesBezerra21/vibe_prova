const fs = require('fs');
let code = fs.readFileSync('src/components/PDFGenerator.tsx', 'utf8');
code = code.replace(
`<DialogTrigger asChild>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Gerar PDFs
        </Button>
      </DialogTrigger>`, 
`<DialogTrigger render={<Button variant="outline" />}>
        <FileDown className="mr-2 h-4 w-4" />
        Gerar PDFs
      </DialogTrigger>`);
fs.writeFileSync('src/components/PDFGenerator.tsx', code);
