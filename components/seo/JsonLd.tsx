/**
 * Renders a schema.org block as JSON-LD.
 *
 * Every structured-data block on the site goes through here, so escaping is
 * handled in exactly one place. `<` is escaped to its unicode form because a
 * literal `</script>` appearing inside a JSON string, in a brand description
 * or an FAQ answer, would otherwise close the script tag early and inject the
 * remainder of the JSON into the document as markup.
 *
 * Server component: it renders to static markup and ships no client JavaScript.
 */

type JsonLdProps = {
  /** A schema.org object, or an array of them to emit as a @graph. */
  readonly data: object | readonly object[];
  /**
   * Optional. Sets the script tag's id, which makes a block identifiable in
   * DevTools and in the Rich Results Test when a page carries several.
   */
  readonly id?: string;
};

export default function JsonLd({ data, id }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : data;

  const json = JSON.stringify(payload).replace(/</g, '\\u003c');

  return (
    <script
      {...(id ? { id } : {})}
      type="application/ld+json"
      // The content is JSON.stringify output of objects this repo controls,
      // never user input, and the one character that could break out of the
      // script context is escaped above.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
