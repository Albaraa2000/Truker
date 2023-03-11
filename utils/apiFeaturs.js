class APIFeatures {
  constructor(query, queryString) {
    // query =======> collection in database && queryString ======> req.query 
    //const features = new APIFeatures(Tour, req.query)
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    // console.log(queryObj); // ======> { sort: 'price,ratingsAverage', difficulty: 'easy' }
    //i want to exclude them because they are not in the database
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((ele) => {
      delete queryObj[ele]; // =====> queryObj['page']
    });

    //1B-advanced filtering
    let queryStr = JSON.stringify(queryObj); //type : JSON && turned that to json(string) to use replace method
    let reg = /\b(gt|gte|lt|lte)\b/g;
    queryStr = queryStr.replace(reg, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //price,ratingsAverage ====> price ratingsAverage
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' '); // //price,ratingsAverage ====> price ratingsAverage
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = +this.queryString.page || 1; // page 1 1-10 page 2 11 - 20
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
