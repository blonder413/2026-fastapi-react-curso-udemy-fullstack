interface CategoryMenuProps {
  categories: string[];
}

const CategoryMenu = ({ categories }: CategoryMenuProps) => {
  return (
    <div className="row">
      <div className="col-lg-12 d-flex justify-content-center">
        <ul className="nav nav-tabs mb-5">
          {categories.map((category, index) => (
            <li className="nav-item" key={index}>
              <a
                className="nav-link"
                data-bs-toggle="tab"
                href={`#categoria-${index + 1}`}
                title={category}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryMenu;
