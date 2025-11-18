function status(request, respose) {
  respose.status(200).json({ valor: "teste drive ^d~~" });
  return respose.redirect(307, "/new-route");
}

export default status;
