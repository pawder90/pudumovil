// Regla del proyecto (ver CLAUDE.md): los componentes solo usan tokens semánticos
// o de componente, nunca colores sueltos. Este linter falla si aparece un color
// hexadecimal o una función rgb()/hsl() dentro de src/components/ o src/features/.
// Se ejecuta con `npm run lint:styles`.
export default {
  extends: 'stylelint-config-standard',
  rules: {
    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
    'custom-property-pattern': null,
    'selector-class-pattern': null,
  },
}
