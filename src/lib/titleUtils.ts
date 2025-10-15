// let titleCache: Record<string, string> = {};

// export async function initializeTitleCache() {
//   if (Object.keys(titleCache).length === 0) {
//     try {
//       const titlesUrl = 'https://raw.githubusercontent.com/nanyinsbedroom/titles/refs/heads/main/DT_Title_Balance.json';
//       const res = await fetch(titlesUrl);
//       if (res.ok) {
//         const data = await res.json();
        
//         data.forEach((table: any) => {
//           if (table.Name === 'DT_Title_Balance' && table.Rows) {
//             Object.entries(table.Rows).forEach(([titleId, row]: [string, any]) => {
//               titleCache[titleId] = row.Name?.LocalizedString || titleId;
//             });
//           }
//         });
//       }
//     } catch (error) {
//       console.error("Error initializing title cache:", error);
//     }
//   }
//   return titleCache;
// }

// export function getTitleName(titleId: string): string {
//   return titleCache[titleId] || titleId;
// }

// export function getTitleColor(titleId: string): string | null {
//   // You can extend this to return title colors if needed
//   return null;
// }