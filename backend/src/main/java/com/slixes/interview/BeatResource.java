package com.slixes.interview;

import com.slixes.interview.model.Act;
import com.slixes.interview.model.ActRepository;
import com.slixes.interview.model.Beat;
import com.slixes.interview.model.BeatRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

import java.net.URI;
import java.util.List;

@Path("/beats")
@Produces(MediaType.APPLICATION_JSON)
public class BeatResource {

  @Inject
  BeatRepository beatRepository;

  @GET
  @Path("{id}")
  @WithTransaction
  public Uni<Beat> getBeatById(@PathParam("id") Long id) {
    return beatRepository.findById(id);
  }
}