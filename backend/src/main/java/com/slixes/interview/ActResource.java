package com.slixes.interview;

import com.slixes.interview.model.Act;
import com.slixes.interview.model.ActRepository;
import com.slixes.interview.model.Beat;
import com.slixes.interview.model.BeatRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import lombok.With;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Path("/acts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ActResource {

  @Inject
  ActRepository actRepository;

  @Inject
  UriInfo uriInfo;

  @Inject
  BeatRepository beatRepository;

  @POST
  @WithTransaction
  public Uni<Response> createAct(Act act) {
    return actRepository.persistAndFlush(act)
        .map(ignore -> {
          var resourceUri = uriInfo.getAbsolutePathBuilder().path(act.getId().toString()).build().getPath();
          return Response.created(URI.create(resourceUri)).entity(act).build();
        });
  }


  @GET
  @Path("{id}")
  @WithTransaction
  public Uni<Act> getActById(@PathParam("id") Long id) {
    return actRepository.findById(id);
  }

  @POST
  @Path("{id}/beats")
  @WithTransaction
  public Uni<Response> addBeatToAct(@PathParam("id") Long actId, Beat beat) {
    return actRepository.findById(actId)
        .onItem().ifNotNull().transformToUni(act -> {
          beat.setAct(act);
          return beatRepository.persistAndFlush(beat);
        })
        .onItem().ifNotNull().transform(ignore -> {
          URI uri = UriBuilder.fromResource(BeatResource.class)
              .path(Long.toString(beat.getId()))
              .build();
          return Response.created(uri).entity(beat).build();
        })
        .onFailure().recoverWithItem(Response.status(Response.Status.NOT_FOUND).build());
  }

  @DELETE
  @Path("{actId}/beats/{beatId}")
  @WithTransaction
  public Uni<Response> deleteBeatFromAct(@PathParam("actId") Long actId, @PathParam("beatId") Long beatId) {
    return actRepository.findById(actId)
        .onItem().ifNotNull().transformToUni(act -> beatRepository.delete("id = ?1 and act.id = ?2", beatId, actId))
        .onItem().ifNotNull().transform(ignore -> Response.status(Response.Status.NO_CONTENT).build())
        .onFailure().recoverWithItem(Response.status(Response.Status.NOT_FOUND).build());
  }

  @GET
  @Path("{id}/beats")
  @WithTransaction
  public Uni<Response> getBeatsForAct(@PathParam("id") Long actId) {
    return beatRepository.find("from Beat where act.id = ?1", actId).list()
        .onItem().ifNotNull().transformToUni(list -> Uni.createFrom().item(Response.ok(list).build()))
        .onFailure().recoverWithItem(Response.status(Response.Status.NOT_FOUND).build());
  }

  @DELETE
  @Path("{id}")
  @WithTransaction
  public Uni<Response> deleteAct(@PathParam("id") Long id) {
    return actRepository.findById(id)
        .onItem().ifNotNull().transformToUni(act -> actRepository.delete(act))
        .onItem().ifNotNull().transform(ignore -> Response.status(Response.Status.NO_CONTENT).build())
        .onFailure().recoverWithItem(Response.status(Response.Status.NOT_FOUND).build());
  }

  @GET
  @WithTransaction
  public Uni<List<Act>> getAllActs() {
    return actRepository.listAll();
  }

  @PUT
  @Path("/beats/{id}")
  @WithTransaction
  public Uni<Response> updateBeat(@PathParam("id") Long id, Beat newBeat) {
    return beatRepository.findById(id)
        .onItem().ifNotNull().transformToUni(existingBeat -> {
          existingBeat.setName(newBeat.getName());
          existingBeat.setTime(newBeat.getTime());
          existingBeat.setContent(newBeat.getContent());
          existingBeat.setCameraAngle(newBeat.getCameraAngle());
          existingBeat.setNotes(newBeat.getNotes());
          return beatRepository.persistAndFlush(existingBeat);
        })
        .onItem().ifNotNull().transform(ignore -> Response.status(Response.Status.OK).build())
        .onFailure().recoverWithItem(Response.status(Response.Status.NOT_FOUND).build());
  }
}