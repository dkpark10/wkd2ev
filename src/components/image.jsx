export function NextImage({ src, alt, ...props }) {
  const prefix = process.env.NODE_ENV === "production" ? "/wkd2ev" : "";
  return (
    <img {...props} src={`${prefix}${src}`} alt={alt || ""} />
  );
}

export function MdxImage({ src, alt, ...props }) {
  const prefix = process.env.NODE_ENV === "production" ? "/wkd2ev" : "";
  return (
    <div className="mdx_img_container">
      <img {...props} src={`${prefix}${src}`} alt={alt || ""} />
    </div>
  );
}
