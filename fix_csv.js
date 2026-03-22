const fs = require('fs');
let code = fs.readFileSync('src/components/PDFGenerator.tsx', 'utf8');

const regex = /let csvContent[\s\S]*?zip\.file\("Gabarito\.csv", csvContent\);/m;

const newCode = `let headers = ["Prova", ...provaData.questions.map((_, i) => "Q" + (i + 1))].join(",");
      let csvLines = [headers];

      for (let i = 1; i <= numProvas; i++) {
        // Shuffle questions
        const shuffledQuestions = shuffleArray(provaData.questions).map((q) => {
          // Shuffle options
          const shuffledOpts = shuffleArray(q.options);
          return {
            ...q,
            shuffledOptions: shuffledOpts
          };
        });

        // Compute gabarito
        let testGabarito = [i.toString()];

        shuffledQuestions.forEach((q, qIdx) => {
          let expected = "";
          const correctAnswerIds = q.correctOptionId.split(',');

          if (q.type === 'sum_choice') {
            let sum = 0;
            q.shuffledOptions.forEach((opt, optIdx) => {
              if (correctAnswerIds.includes(opt.id)) {
                sum += Math.pow(2, optIdx);
              }
            });
            expected = sum.toString();
          } else {
            const correctLetters = [];
            q.shuffledOptions.forEach((opt, optIdx) => {
              if (correctAnswerIds.includes(opt.id)) {
                correctLetters.push(String.fromCharCode(65 + optIdx));
              }
            });
            expected = correctLetters.join('-');
          }
          testGabarito.push(expected);
        });
        
        csvLines.push(testGabarito.join(','));

        const doc = (
          <ProvaPDF 
            provaNum={i}
            questions={shuffledQuestions}
            disciplina={disciplina}
            professor={professor}
            data={dataStr}
            titulo={provaData.title}
          />
        );

        const blob = await pdf(doc).toBlob();
        zip.file(\`Prova_\${i}.pdf\`, blob);
      }

      zip.file("Gabarito.csv", csvLines.join("\\n"));`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/PDFGenerator.tsx', code);
